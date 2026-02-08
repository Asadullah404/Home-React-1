import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { db } from "../firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Chart from "chart.js/auto";
import { GlassCard, NeonButton } from "../components/FuturisticUI";

const GenPDF = () => {
  const [meterIds, setMeterIds] = useState([]);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedMeterIds, setSelectedMeterIds] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchMeterIds();
  }, []);

  const fetchMeterIds = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const readingsRef = collection(db, "readings");
      const q = query(
        readingsRef,
        where("uid", "==", user.uid),
        orderBy("meterId", "asc")
      );
      const readingsSnapshot = await getDocs(q);
      let meterIdsSet = new Set();

      readingsSnapshot.forEach((doc) => {
        meterIdsSet.add(doc.data().meterId);
      });
      setMeterIds([...meterIdsSet]);
    }
  };

  // Enhanced image loading with better quality
  const loadImageBase64 = (path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Use higher resolution for better quality
        const scale = 1;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png", 1.0));
      };
      img.onerror = reject;
    });
  };

  // Enhanced data fetching with better sorting
  const fetchReadingsData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return {};

    const readingsRef = collection(db, "readings");
    const q = query(
      readingsRef,
      where("uid", "==", user.uid),
      where("meterId", "in", selectedMeterIds),
      orderBy("meterId", "asc"),
      orderBy("readingDate", "asc")
    );
    const querySnapshot = await getDocs(q);

    let readingsByMeter = {};
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const readingDate = new Date(data.readingDate);

      if (
        readingDate >= new Date(fromDate) &&
        readingDate <= new Date(toDate)
      ) {
        if (!readingsByMeter[data.meterId]) readingsByMeter[data.meterId] = [];
        readingsByMeter[data.meterId].push({
          date: readingDate,
          dateString: readingDate.toLocaleDateString('en-GB'),
          reading: parseFloat(data.reading) || 0,
          rawData: data
        });
      }
    });

    // Sort readings by date for each meter
    Object.keys(readingsByMeter).forEach(meterId => {
      readingsByMeter[meterId].sort((a, b) => a.date - b.date);
    });

    return readingsByMeter;
  };

  // Create high-quality chart with enhanced configuration  88888888888888888888888888888888888888888888888888888888
  const createHighQualityChart = (canvas, type, data, options = {}) => {
    return new Promise((resolve) => {
      // Dynamically size canvas (fit screen but max 800px)
      const screenWidth = window.innerWidth || 800;
      const width = Math.min(800, screenWidth - 20); // margin on sides
      const height = Math.floor(width * 0.6); // 3:2 aspect ratio (good for charts)

      // Set both internal & CSS sizes
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";

      const ctx = canvas.getContext("2d");

      const chart = new Chart(ctx, {
        type: type,
        data: data,
        options: {
          responsive: false,          // force fixed size
          maintainAspectRatio: false, // respect our width/height
          animation: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
              labels: {
                font: { size: 9, weight: "bold" },
                color: "#333",
              },
            },
            title: {
              display: !!options.title,
              text: options.title || "",
              font: { size: 12, weight: "bold" },
              color: "#333",
              padding: 10,
            },
          },
          scales:
            type !== "pie" && type !== "doughnut"
              ? {
                x: {
                  title: { display: true, text: options.xAxisLabel || "Date" },
                  ticks: { font: { size: 8 }, maxRotation: 45 },
                },
                y: {
                  title: { display: true, text: options.yAxisLabel || "Reading" },
                  ticks: { font: { size: 8 } },
                  beginAtZero: options.beginAtZero !== false,
                },
              }
              : {},
        },
      });

      // Export after render
      setTimeout(() => {
        // Create export canvas with same size
        const exportCanvas = document.createElement("canvas");
        exportCanvas.width = width;
        exportCanvas.height = height;

        const exportCtx = exportCanvas.getContext("2d");
        exportCtx.fillStyle = "#ffffff"; // white background
        exportCtx.fillRect(0, 0, width, height);
        exportCtx.drawImage(canvas, 0, 0, width, height);

        // JPEG compression
        const chartImage = exportCanvas.toDataURL("image/jpeg", 0.7);

        resolve(chartImage);
        chart.destroy();
      }, 300);
    });
  };

  // Enhanced color palette
  const getColorPalette = (index) => {
    const colors = [
      { bg: 'rgba(54, 162, 235, 0.2)', border: 'rgb(54, 162, 235)' },
      { bg: 'rgba(255, 99, 132, 0.2)', border: 'rgb(255, 99, 132)' },
      { bg: 'rgba(75, 192, 192, 0.2)', border: 'rgb(75, 192, 192)' },
      { bg: 'rgba(255, 206, 86, 0.2)', border: 'rgb(255, 206, 86)' },
      { bg: 'rgba(153, 102, 255, 0.2)', border: 'rgb(153, 102, 255)' },
      { bg: 'rgba(255, 159, 64, 0.2)', border: 'rgb(255, 159, 64)' },
      { bg: 'rgba(199, 199, 199, 0.2)', border: 'rgb(199, 199, 199)' },
      { bg: 'rgba(83, 102, 255, 0.2)', border: 'rgb(83, 102, 255)' }
    ];
    return colors[index % colors.length];
  };

  // Add professional header with logo and metadata
  const addProfessionalHeader = async (doc, title, subtitle = null) => {
    const pageWidth = doc.internal.pageSize.width;

    // Header background
    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Load and add logo
    try {
      const logoImage = await loadImageBase64('/vite.png');
      // Add logo on the left side of header
      doc.addImage(logoImage, 'PNG', 10, 10, 30, 30);
    } catch (e) {
      console.log('Logo not available:', e);
    }

    // Title - positioned to the right of logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 50, 25, { align: 'left' });

    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 50, 35, { align: 'left' });
    }

    // Reset text color
    doc.setTextColor(0, 0, 0);

    return 60; // Return Y position after header
  };

  // Add footer with page numbers and generation info
  const addFooter = (doc, pageNum, totalPages, generatedDate) => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' });
    doc.text(`Generated on: ${generatedDate}`, 20, pageHeight - 10);
  };

  // Enhanced Detailed PDF with consumption analysis
  const generateDetailedPDF = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      if (!fromDate || !toDate || selectedMeterIds.length === 0) {
        alert("Please select meter IDs and dates.");
        setIsGenerating(false);
        return;
      }

      console.log('Starting detailed PDF generation...');

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;
      const generatedDate = new Date().toLocaleString();
      let pageCount = 1;

      let y = await addProfessionalHeader(
        doc,
        'Detailed Consumption Analysis Report',
        `Period: ${new Date(fromDate).toLocaleDateString()} - ${new Date(toDate).toLocaleDateString()}`
      );

      console.log('Fetching readings data...');
      const readingsByMeter = await fetchReadingsData();

      if (!readingsByMeter || Object.keys(readingsByMeter).length === 0) {
        throw new Error('No data found for the selected criteria');
      }

      console.log('Processing meters:', Object.keys(readingsByMeter));

      for (let meterId of Object.keys(readingsByMeter)) {
        try {
          const data = readingsByMeter[meterId];

          if (!data || data.length === 0) {
            console.log(`No data for meter ${meterId}, skipping...`);
            continue;
          }

          console.log(`Processing meter ${meterId} with ${data.length} readings`);

          if (y + 100 > pageHeight - 30) {
            addFooter(doc, pageCount, '?', generatedDate);
            doc.addPage();
            pageCount++;
            y = await addProfessionalHeader(doc, 'Detailed Consumption Analysis (Continued)');
            y += 10;
          }

          // Meter header
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(41, 128, 185);
          doc.text(`Meter ${meterId} - Detailed Consumption Breakdown`, 20, y);
          y += 15;

          // Calculate consumption data with better error handling
          let consumptionData = [];
          let totalUnits = 0;
          let maxDaily = 0;
          let minDaily = Infinity;
          let validReadings = 0;
          let avgDaily = 0;

          // Sort data by date to ensure proper calculation
          const sortedData = data.sort((a, b) => a.date - b.date);

          for (let i = 1; i < sortedData.length; i++) {
            try {
              const prevReading = parseFloat(sortedData[i - 1].reading) || 0;
              const currReading = parseFloat(sortedData[i].reading) || 0;
              const units = currReading - prevReading;

              // Only include positive consumption (handle meter resets)
              if (units >= 0 && units < 10000) { // Reasonable upper limit to filter out meter resets
                const changePercentage = prevReading > 0 ? ((units / prevReading) * 100) : 0;

                consumptionData.push([
                  sortedData[i].dateString || sortedData[i].date.toLocaleDateString(),
                  prevReading.toFixed(2),
                  currReading.toFixed(2),
                  units.toFixed(2),
                  changePercentage.toFixed(1) + '%'
                ]);

                totalUnits += units;
                maxDaily = Math.max(maxDaily, units);
                minDaily = Math.min(minDaily, units);
                validReadings++;
              }
            } catch (err) {
              console.warn(`Error processing reading ${i} for meter ${meterId}:`, err);
            }
          }

          if (validReadings > 0) {
            avgDaily = totalUnits / validReadings;

            // Consumption statistics box
            doc.setFillColor(252, 248, 227);
            doc.roundedRect(20, y, pageWidth - 40, 25, 2, 2, 'F');

            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(133, 100, 4);
            doc.text('Consumption Summary:', 25, y + 8);

            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 0);
            doc.text(`Total: ${totalUnits.toFixed(2)} units | Average: ${avgDaily.toFixed(2)} units/reading | Range: ${minDaily.toFixed(2)} - ${maxDaily.toFixed(2)} units`, 25, y + 16);

            y += 35;
          }

          // Detailed consumption table
          if (consumptionData.length > 0) {
            try {
              doc.autoTable({
                head: [['Date', 'Previous Reading', 'Current Reading', 'Units Consumed', 'Change %']],
                body: consumptionData,
                startY: y,
                styles: {
                  fontSize: 8,
                  cellPadding: 2
                },
                headStyles: {
                  fillColor: [41, 128, 185],
                  textColor: 255,
                  fontSize: 9,
                  fontStyle: 'bold'
                },
                alternateRowStyles: {
                  fillColor: [248, 249, 250]
                },
                columnStyles: {
                  0: { halign: 'center' },
                  1: { halign: 'right' },
                  2: { halign: 'right' },
                  3: { halign: 'right', fontStyle: 'bold' },
                  4: { halign: 'center' }
                },
                didParseCell: (data) => {
                  try {
                    if (data.column.index === 3 && data.cell.text[0] !== 'Units Consumed' && validReadings > 0) {
                      const value = parseFloat(data.cell.text[0]);
                      if (!isNaN(value)) {
                        if (value > avgDaily * 1.5) {
                          data.cell.styles.textColor = [220, 53, 69]; // Red for high consumption
                        } else if (value < avgDaily * 0.5 && value > 0) {
                          data.cell.styles.textColor = [40, 167, 69]; // Green for low consumption
                        }
                      }
                    }
                  } catch (err) {
                    console.warn('Error in didParseCell:', err);
                  }
                }
              });

              y = doc.lastAutoTable.finalY + 15;

              // Add consumption trend chart for this meter
              if (consumptionData.length > 1) {
                try {
                  if (y + 100 > pageHeight - 30) {
                    addFooter(doc, pageCount, '?', generatedDate);
                    doc.addPage();
                    pageCount++;
                    y = await addProfessionalHeader(doc, 'Detailed Consumption Analysis (Continued)');
                    y += 10;
                  }

                  console.log(`Creating chart for meter ${meterId}...`);

                  const canvas = document.createElement('canvas');
                  const meterIndex = Object.keys(readingsByMeter).indexOf(meterId);
                  const color = getColorPalette(meterIndex);

                  const chartData = {
                    labels: consumptionData.slice(0, 20).map((row) => row[0]), // Limit to 20 points for readability
                    datasets: [{
                      label: 'Daily Consumption',
                      data: consumptionData.slice(0, 20).map((row) => parseFloat(row[3])),
                      borderColor: color.border,
                      backgroundColor: color.bg,
                      borderWidth: 2,
                      fill: true,
                      tension: 0.1,
                      pointRadius: 2,
                      pointHoverRadius: 4
                    }]
                  };

                  const chartOptions = {
                    title: `Daily Consumption Pattern - Meter ${meterId}`,
                    xAxisLabel: 'Date',
                    yAxisLabel: 'Units Consumed',
                    beginAtZero: true
                  };

                  const chartImage = await createHighQualityChart(canvas, 'line', chartData, chartOptions);

                  doc.setFontSize(12);
                  doc.setFont('helvetica', 'bold');
                  doc.setTextColor(52, 73, 94);
                  doc.text(`Consumption Pattern - Meter ${meterId}`, 20, y);
                  y += 10;

                  doc.addImage(chartImage, 'PNG', 20, y, pageWidth - 40, 70);
                  y += 85;

                  console.log(`Chart created successfully for meter ${meterId}`);
                } catch (chartError) {
                  console.error(`Error creating chart for meter ${meterId}:`, chartError);
                  // Continue without chart
                  doc.setTextColor(255, 165, 0);
                  doc.setFontSize(10);
                  doc.text(`⚠️ Chart could not be generated for meter ${meterId}`, 20, y);
                  y += 15;
                }
              }
            } catch (tableError) {
              console.error(`Error creating table for meter ${meterId}:`, tableError);
              doc.setTextColor(220, 53, 69);
              doc.setFontSize(10);
              doc.text(`⚠️ Error processing consumption data for meter ${meterId}`, 20, y);
              y += 15;
            }
          } else {
            doc.setTextColor(220, 53, 69);
            doc.setFontSize(10);
            doc.text(`⚠️ No valid consumption data available for meter ${meterId} in the selected period.`, 20, y);
            y += 15;
          }
        } catch (meterError) {
          console.error(`Error processing meter ${meterId}:`, meterError);
          doc.setTextColor(220, 53, 69);
          doc.setFontSize(10);
          doc.text(`⚠️ Error processing meter ${meterId}: ${meterError.message}`, 20, y);
          y += 15;
        }
      }

      // Add final footer
      addFooter(doc, pageCount, pageCount, generatedDate);

      console.log('Saving PDF...');
      doc.save(`detailed_consumption_report_${new Date().toISOString().split('T')[0]}.pdf`);
      console.log('PDF saved successfully!');

    } catch (error) {
      console.error('Error generating detailed PDF:', error);
      alert(`Error generating detailed PDF: ${error.message}. Please check your data and try again.`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <GlassCard className="max-w-3xl w-full p-8">
        <h1 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-500 mb-8">
          📊 Generate Detailed Consumption Report
        </h1>

        <div className="bg-green-900/30 border-l-4 border-green-500 p-4 mb-8 rounded backdrop-blur-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-300">
                <strong>Detailed Analysis Features:</strong> Granular consumption breakdown, daily usage patterns, detailed tables with all readings, and usage anomaly highlighting.
              </p>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-lg text-gray-300 font-semibold mb-2">
              📋 Select Meter IDs:
            </label>
            <select
              multiple
              value={selectedMeterIds}
              onChange={(e) =>
                setSelectedMeterIds(
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="mt-2 p-3 w-full bg-black/50 border border-green-500/30 text-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[120px] transition-all"
            >
              {meterIds.map((meterId) => (
                <option key={meterId} value={meterId} className="hover:bg-green-500/20 p-2 rounded">
                  📊 Meter {meterId}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-2">Hold Ctrl/Cmd to select multiple meters</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg text-gray-300 font-semibold mb-2">
                📅 From Date:
              </label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="mt-2 p-3 w-full bg-black/50 border border-green-500/30 text-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-lg text-gray-300 font-semibold mb-2">
                📅 To Date:
              </label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="mt-2 p-3 w-full bg-black/50 border border-green-500/30 text-white rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <NeonButton
              onClick={generateDetailedPDF}
              disabled={isGenerating}
              className="px-8 py-4 w-full md:w-auto !border-green-500 !text-green-400 hover:!bg-green-500/20 shadow-[0_0_15px_rgba(74,222,128,0.3)]"
            >
              {isGenerating ? '🔄 Processing...' : '📈 Generate Detailed Report'}
            </NeonButton>
          </div>

          {/* Progress indicator */}
          {isGenerating && (
            <div className="mt-6 bg-black/40 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-400 mr-3"></div>
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-green-400">Generating detailed consumption analysis report...</p>
                  <p className="text-gray-500 text-xs mt-1">This may take a few moments for optimal chart rendering and data processing.</p>
                </div>
              </div>
            </div>
          )}

          {/* Report features */}
          <div className="mt-8">
            <div className="bg-black/30 border border-green-500/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-green-400 mb-4">📈 What's Included in Your Report:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">📊 Data Analysis</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Granular consumption breakdown</li>
                    <li>• Daily usage patterns and trends</li>
                    <li>• Consumption statistics per meter</li>
                    <li>• Usage anomaly highlighting</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-green-300 mb-2">🎨 Visual Features</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Professional header with company logo</li>
                    <li>• High-quality consumption charts</li>
                    <li>• Detailed tables with all readings</li>
                    <li>• Color-coded consumption indicators</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Usage tips */}
          <div className="mt-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
            <h4 className="text-md font-bold text-yellow-400 mb-2">💡 Usage Tips:</h4>
            <ul className="text-sm text-yellow-200/70 space-y-1">
              <li>• Select multiple meters for comprehensive analysis</li>
              <li>• Choose appropriate date ranges for meaningful insights</li>
              <li>• Report includes your company logo automatically</li>
              <li>• All charts are rendered in high-quality for printing</li>
              <li>• Perfect for operational review and audit purposes</li>
            </ul>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default GenPDF;

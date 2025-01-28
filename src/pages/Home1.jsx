"use client"
import React, { useState } from "react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader } from "../components/ui/Card"

const Home1 = () => {
  // State for Guess the Number
  const [targetNumber, setTargetNumber] = useState(Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState("")
  const [guessMessage, setGuessMessage] = useState("")

  // State for Memory Card
  const [cards, setCards] = useState(shuffleCards())
  const [flipped, setFlipped] = useState(Array(16).fill(false))
  const [solved, setSolved] = useState(Array(16).fill(false))
  const [disabled, setDisabled] = useState(false)

  // State for Whack-a-Mole
  const [molePosition, setMolePosition] = useState(-1)
  const [whackScore, setWhackScore] = useState(0)

  // State for Tic Tac Toe
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)

  // State for Rock Paper Scissors
  const [playerChoice, setPlayerChoice] = useState(null)
  const [computerChoice, setComputerChoice] = useState(null)
  const [rpsResult, setRpsResult] = useState(null)

  // State for Color Guess
  const [colorToGuess, setColorToGuess] = useState(generateColor())
  const [colorOptions, setColorOptions] = useState(generateColorOptions())
  const [colorMessage, setColorMessage] = useState("")

  // State for Hangman
  const [hangmanWord, setHangmanWord] = useState(getRandomWord())
  const [guessedLetters, setGuessedLetters] = useState(new Set())
  const [remainingGuesses, setRemainingGuesses] = useState(6)

  // State for Word Scramble
  const [scrambledWord, setScrambledWord] = useState(scrambleWord(getRandomWord()))
  const [unscrambledGuess, setUnscrambledGuess] = useState("")
  const [scrambleMessage, setScrambleMessage] = useState("")

  // State for Math Quiz
  const [mathQuestion, setMathQuestion] = useState(generateMathQuestion())
  const [mathAnswer, setMathAnswer] = useState("")
  const [mathScore, setMathScore] = useState(0)

  // State for Simon Says
  const [simonSequence, setSimonSequence] = useState([])
  const [userSequence, setUserSequence] = useState([])

  // Game logic functions
  function shuffleCards() {
    const emojis = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"]
    return [...emojis, ...emojis].sort(() => Math.random() - 0.5)
  }

  function generateColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16)
  }

  function generateColorOptions() {
    return [generateColor(), generateColor(), generateColor()].sort(() => Math.random() - 0.5)
  }

  function getRandomWord() {
    const words = ["REACT", "NEXTJS", "TYPESCRIPT", "JAVASCRIPT", "VERCEL"]
    return words[Math.floor(Math.random() * words.length)]
  }

  function scrambleWord(word) {
    return word
      .split(" ")
      .sort(() => Math.random() - 0.5)
      .join("")
  }

  function generateMathQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1
    const num2 = Math.floor(Math.random() * 10) + 1
    const operator = ["+", "-", "*"][Math.floor(Math.random() * 3)]
    return { num1, num2, operator }
  }

  // Game components
  const GuessNumber = () => (
    <Card className="bg-white">
      <CardHeader>
        <h2>Guess the Number</h2>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label htmlFor="guessInput" className="block text-sm font-medium text-gray-700">Enter your guess:</label>
          <input
            id="guessInput"
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Pick a number between 1 and 100"
            className="mt-1 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            min="1"
            max="100"
          />
        </div>
  
        <Button
          onClick={() => {
            const guessNum = Number.parseInt(guess)
            if (isNaN(guessNum)) {
              setGuessMessage("Please enter a valid number!")
              return
            }
            if (guessNum === targetNumber) {
              setGuessMessage("Correct! 🎉")
              setTargetNumber(Math.floor(Math.random() * 100) + 1)
            } else if (guessNum < targetNumber) {
              setGuessMessage("Too low! Try again!")
            } else {
              setGuessMessage("Too high! Try again!")
            }
          }}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Guess
        </Button>
  
        {guessMessage && <p className="mt-4 text-lg text-blue-600">{guessMessage}</p>}
      </CardContent>
    </Card>
  )
  

  const MemoryCard = () => (
    <Card className="bg-white">
      <CardHeader>
        <h2>Memory Card</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {cards.map((card, index) => (
            <Button
              key={index}
              onClick={() => {
                if (disabled || flipped[index] || solved[index]) return
                const newFlipped = [...flipped]
                newFlipped[index] = true
                setFlipped(newFlipped)
                const flippedCards = newFlipped.reduce(
                  (acc, cur, idx) => (cur && !solved[idx] ? [...acc, idx] : acc),
                  [],
                )
                if (flippedCards.length === 2) {
                  setDisabled(true)
                  if (cards[flippedCards[0]] === cards[flippedCards[1]]) {
                    setSolved((prev) => {
                      const newSolved = [...prev]
                      newSolved[flippedCards[0]] = true
                      newSolved[flippedCards[1]] = true
                      return newSolved
                    })
                    setDisabled(false)
                  } else {
                    setTimeout(() => {
                      setFlipped((prev) => {
                        const newFlipped = [...prev]
                        newFlipped[flippedCards[0]] = false
                        newFlipped[flippedCards[1]] = false
                        return newFlipped
                      })
                      setDisabled(false)
                    }, 1000)
                  }
                }
              }}
              className={`h-16 ${flipped[index] || solved[index] ? "bg-blue-200" : "bg-blue-500"} text-white`}
            >
              {(flipped[index] || solved[index]) && card}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const WhackAMole = () => (
    <Card className="bg-white">
      <CardHeader>
        <h2>Whack-a-Mole</h2>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[...Array(9)].map((_, index) => (
            <Button
              key={index}
              onClick={() => {
                if (index === molePosition) {
                  setWhackScore(whackScore + 1)
                  setMolePosition(Math.floor(Math.random() * 9))
                }
              }}
              className={`h-16 ${index === molePosition ? "bg-blue-500" : "bg-blue-200"}`}
            >
              {index === molePosition && "🐭"}
            </Button>
          ))}
        </div>
        <p>Score: {whackScore}</p>
      </CardContent>
    </Card>
  )

  // Add other games here following the same structure...

  return (
    <div>
      <GuessNumber />
      <MemoryCard />
      <WhackAMole />
      {/* Add other game components */}
    </div>
  )
}

export default Home1

"use client"
import React, { useState, useEffect } from "react"
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
      .split("")
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

  const TicTacToe = () => {
    const calculateWinner = (squares) => {
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ]
      for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a]
        }
      }
      return null
    }

    const handleClick = (i) => {
      if (board[i] || calculateWinner(board)) return
      const newBoard = [...board]
      newBoard[i] = xIsNext ? "X" : "O"
      setBoard(newBoard)
      setXIsNext(!xIsNext)
    }

    const winner = calculateWinner(board)
    const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? "X" : "O"}`

    return (
      <Card className="bg-white">
        <CardHeader>
          <h2>Tic Tac Toe</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => (
              <Button
                key={index}
                onClick={() => handleClick(index)}
                className="h-16 bg-blue-500 text-white"
              >
                {cell}
              </Button>
            ))}
          </div>
          <p className="mt-4 text-lg">{status}</p>
        </CardContent>
      </Card>
    )
  }

  const RockPaperScissors = () => {
    const choices = ["Rock", "Paper", "Scissors"]

    const handleChoice = (choice) => {
      const computerChoice = choices[Math.floor(Math.random() * 3)]
      setPlayerChoice(choice)
      setComputerChoice(computerChoice)
      if (choice === computerChoice) {
        setRpsResult("It's a tie!")
      } else if (
        (choice === "Rock" && computerChoice === "Scissors") ||
        (choice === "Paper" && computerChoice === "Rock") ||
        (choice === "Scissors" && computerChoice === "Paper")
      ) {
        setRpsResult("You win!")
      } else {
        setRpsResult("You lose!")
      }
    }

    return (
      <Card className="bg-white">
        <CardHeader>
          <h2>Rock Paper Scissors</h2>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {choices.map((choice) => (
              <Button
                key={choice}
                onClick={() => handleChoice(choice)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {choice}
              </Button>
            ))}
          </div>
          {playerChoice && computerChoice && (
            <p className="text-lg">
              You chose {playerChoice}, computer chose {computerChoice}. {rpsResult}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  const ColorGuess = () => {
    const handleGuess = (color) => {
      if (color === colorToGuess) {
        setColorMessage("Correct! 🎉")
        setColorToGuess(generateColor())
        setColorOptions(generateColorOptions())
      } else {
        setColorMessage("Wrong! Try again!")
      }
    }

    return (
      <Card className="bg-white">
        <CardHeader>
          <h2>Color Guess</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div
              className="h-16 w-full rounded-lg"
              style={{ backgroundColor: colorToGuess }}
            ></div>
          </div>
          <div className="flex gap-2">
            {colorOptions.map((color, index) => (
              <Button
                key={index}
                onClick={() => handleGuess(color)}
                className="h-16 w-full"
                style={{ backgroundColor: color }}
              ></Button>
            ))}
          </div>
          {colorMessage && <p className="mt-4 text-lg text-blue-600">{colorMessage}</p>}
        </CardContent>
      </Card>
    )
  }

  const Hangman = () => {
    const displayWord = hangmanWord
      .split("")
      .map((letter) => (guessedLetters.has(letter) ? letter : "_"))
      .join(" ")

    const handleGuess = (letter) => {
      if (guessedLetters.has(letter)) return
      setGuessedLetters((prev) => new Set([...prev, letter]))
      if (!hangmanWord.includes(letter)) {
        setRemainingGuesses((prev) => prev - 1)
      }
    }

    useEffect(() => {
      if (remainingGuesses === 0) {
        setColorMessage(`You lost! The word was ${hangmanWord}`)
      } else if (!displayWord.includes("_")) {
        setColorMessage("You won! 🎉")
      }
    }, [remainingGuesses, displayWord, hangmanWord])

    return (
      <Card className="bg-white">
        <CardHeader>
          <h2>Hangman</h2>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{displayWord}</p>
          <p className="text-lg">Remaining guesses: {remainingGuesses}</p>
          <div className="flex gap-2 mt-4">
            {Array.from("ABCDEFGHIJKLMNOPQRSTUVWXYZ").map((letter) => (
              <Button
                key={letter}
                onClick={() => handleGuess(letter)}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                disabled={guessedLetters.has(letter)}
              >
                {letter}
              </Button>
            ))}
          </div>
          {colorMessage && <p className="mt-4 text-lg text-blue-600">{colorMessage}</p>}
        </CardContent>
      </Card>
    )
  }

  const WordScramble = () => {
    const handleGuess = () => {
      if (unscrambledGuess.toUpperCase() === scrambledWord.toUpperCase()) {
        setScrambleMessage("Correct! 🎉")
        setScrambledWord(scrambleWord(getRandomWord()))
        setUnscrambledGuess("")
      } else {
        setScrambleMessage("Wrong! Try again!")
      }
    }

    return (
      <Card className="bg-white">
        <CardHeader>
          <h2>Word Scramble</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-lg">Scrambled word: {scrambledWord}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="unscrambledGuess" className="block text-sm font-medium text-gray-700">Enter your guess:</label>
            <input
              id="unscrambledGuess"
              type="text"
              value={unscrambledGuess}
              onChange={(e) => setUnscrambledGuess(e.target.value)}
              placeholder="Unscramble the word"
              className="mt-1 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleGuess}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Guess
          </Button>
          {scrambleMessage && <p className="mt-4 text-lg text-blue-600">{scrambleMessage}</p>}
        </CardContent>
      </Card>
    )
  }

  const MathQuiz = () => {
    const handleAnswer = () => {
      const correctAnswer = eval(`${mathQuestion.num1} ${mathQuestion.operator} ${mathQuestion.num2}`)
      if (Number(mathAnswer) === correctAnswer) {
        setMathScore(mathScore + 1)
        setMathQuestion(generateMathQuestion())
        setMathAnswer("")
      } else {
        setMathScore(mathScore - 1)
      }
    }

    return (
      <Card className="bg-white">
        <CardHeader>
          <h2>Math Quiz</h2>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-lg">
              What is {mathQuestion.num1} {mathQuestion.operator} {mathQuestion.num2}?
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="mathAnswer" className="block text-sm font-medium text-gray-700">Enter your answer:</label>
            <input
              id="mathAnswer"
              type="number"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="mt-1 p-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleAnswer}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Submit
          </Button>
          <p className="mt-4 text-lg">Score: {mathScore}</p>
        </CardContent>
      </Card>
    )
  }

  const SimonSays = () => {
    const [isPlaying, setIsPlaying] = useState(false)

    useEffect(() => {
      if (isPlaying) {
        const nextSequence = [...simonSequence, Math.floor(Math.random() * 4)]
        setSimonSequence(nextSequence)
        playSequence(nextSequence)
      }
    }, [isPlaying])

    const playSequence = (sequence) => {
      sequence.forEach((color, index) => {
        setTimeout(() => {
          setUserSequence([])
        }, index * 1000)
      })
    }

    const handleColorClick = (color) => {
      if (!isPlaying) return
      const newUserSequence = [...userSequence, color]
      setUserSequence(newUserSequence)
      if (newUserSequence.length === simonSequence.length) {
        if (newUserSequence.every((val, index) => val === simonSequence[index])) {
          setIsPlaying(false)
          setSimonSequence([])
          setUserSequence([])
        } else {
          setIsPlaying(false)
          setSimonSequence([])
          setUserSequence([])
        }
      }
    }

    return (
      <Card className="bg-white">
        <CardHeader>
          <h2>Simon Says</h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {["red", "blue", "green", "yellow"].map((color) => (
              <Button
                key={color}
                onClick={() => handleColorClick(color)}
                className={`h-16 bg-${color}-500 hover:bg-${color}-600 text-white`}
              >
                {color}
              </Button>
            ))}
          </div>
          <Button
            onClick={() => setIsPlaying(true)}
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white"
          >
            Start
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      <GuessNumber />
      <MemoryCard />
      {/* <WhackAMole /> */}
      <TicTacToe />
      <RockPaperScissors />
      <ColorGuess />
      {/* <Hangman /> */}
      <WordScramble />
      <MathQuiz />
      <SimonSays />
    </div>
  )
}

export default Home1

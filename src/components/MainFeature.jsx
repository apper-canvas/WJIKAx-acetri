import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  Users, 
  Plus, 
  Minus, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  RefreshCw,
  Award,
  Bot
} from 'lucide-react'

// Card suits and values
const suits = ['hearts', 'diamonds', 'clubs', 'spades']
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

// Generate a shuffled deck
const generateDeck = () => {
  const deck = []
  for (const suit of suits) {
    for (const value of values) {
      deck.push({ suit, value })
    }
  }
  
  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  
  return deck
}

// Get card color based on suit
const getCardColor = (suit) => {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-red-500' : 'text-black dark:text-white'
}

// Get suit symbol
const getSuitSymbol = (suit) => {
  switch (suit) {
    case 'hearts': return '♥';
    case 'diamonds': return '♦';
    case 'clubs': return '♣';
    case 'spades': return '♠';
    default: return '';
  }
}

// Card component
const Card = ({ card, isRevealed = false, isPlayerCard = false }) => {
  return (
    <motion.div 
      initial={{ rotateY: isRevealed ? 0 : 180 }}
      animate={{ rotateY: isRevealed ? 0 : 180 }}
      transition={{ duration: 0.6 }}
      className="relative w-24 h-36 perspective-1000"
      style={{ 
        transformStyle: 'preserve-3d',
        zIndex: isPlayerCard ? 20 : 10
      }}
    >
      <div 
        className={`absolute inset-0 bg-white border-2 border-gray-200 rounded-lg shadow-md ${getCardColor(card.suit)}`}
        style={{ 
          transform: 'rotateY(0deg)',
          backfaceVisibility: 'hidden',
          zIndex: isRevealed ? 2 : 0
        }}
      >
        <div className="absolute inset-0 flex flex-col justify-between p-2">
          <div className="flex justify-between items-center">
            <div className="font-bold">{card.value}</div>
            <div className="text-lg">{getSuitSymbol(card.suit)}</div>
          </div>
          <div className="flex justify-center items-center text-3xl font-bold">
            {getSuitSymbol(card.suit)}
          </div>
          <div className="flex justify-between items-center rotate-180">
            <div className="font-bold">{card.value}</div>
            <div className="text-lg">{getSuitSymbol(card.suit)}</div>
          </div>
        </div>
      </div>
      
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-800 border-2 border-gray-200 rounded-lg shadow-md"
        style={{ 
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          zIndex: isRevealed ? 0 : 2
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">A♠</span>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full opacity-10">
            <div className="grid grid-cols-5 grid-rows-7 h-full">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="border border-white/20" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const MainFeature = ({ gameMode }) => {
  const [deck, setDeck] = useState([])
  const [playerCards, setPlayerCards] = useState([])
  const [opponentCards, setOpponentCards] = useState([])
  const [pot, setPot] = useState(0)
  const [playerChips, setPlayerChips] = useState(1000)
  const [opponentChips, setOpponentChips] = useState(1000)
  const [currentBet, setCurrentBet] = useState(10)
  const [gameState, setGameState] = useState('betting') // betting, showdown, gameOver
  const [winner, setWinner] = useState(null)
  const [isBlind, setIsBlind] = useState(true)
  const [bootAmount, setBootAmount] = useState(10)
  const [message, setMessage] = useState('')
  
  // Initialize game
  useEffect(() => {
    startNewGame()
  }, [])
  
  const startNewGame = () => {
    const newDeck = generateDeck()
    
    // Deal 3 cards to each player
    const playerNewCards = [newDeck[0], newDeck[2], newDeck[4]]
    const opponentNewCards = [newDeck[1], newDeck[3], newDeck[5]]
    
    setDeck(newDeck.slice(6))
    setPlayerCards(playerNewCards)
    setOpponentCards(opponentNewCards)
    setPot(bootAmount * 2)
    setCurrentBet(bootAmount)
    setGameState('betting')
    setWinner(null)
    setIsBlind(true)
    setMessage('')
    
    // Initial boot amount from both players
    setPlayerChips(prev => prev - bootAmount)
    setOpponentChips(prev => prev - bootAmount)
  }
  
  const handleBet = (action) => {
    switch (action) {
      case 'fold':
        setWinner('opponent')
        setGameState('gameOver')
        setOpponentChips(prev => prev + pot)
        setMessage("You folded. Opponent wins the pot.")
        break
        
      case 'call':
        if (gameState === 'betting') {
          const betAmount = isBlind ? currentBet / 2 : currentBet
          setPlayerChips(prev => prev - betAmount)
          setPot(prev => prev + betAmount)
          
          // AI decision
          const aiDecision = Math.random()
          if (aiDecision < 0.3) {
            // AI folds
            setWinner('player')
            setGameState('gameOver')
            setPlayerChips(prev => prev + pot)
            setMessage("Opponent folded. You win the pot!")
          } else {
            // AI calls and showdown
            setOpponentChips(prev => prev - currentBet)
            setPot(prev => prev + currentBet)
            setGameState('showdown')
            
            // Determine winner
            const playerWins = Math.random() < 0.5 // Simplified for demo
            if (playerWins) {
              setWinner('player')
              setPlayerChips(prev => prev + pot)
              setMessage("You win with a better hand!")
            } else {
              setWinner('opponent')
              setOpponentChips(prev => prev + pot)
              setMessage("Opponent wins with a better hand.")
            }
          }
        }
        break
        
      case 'raise':
        if (gameState === 'betting') {
          const raiseAmount = isBlind ? currentBet : currentBet * 2
          setPlayerChips(prev => prev - raiseAmount)
          setPot(prev => prev + raiseAmount)
          setCurrentBet(prev => prev * 2)
          
          // AI decision
          const aiDecision = Math.random()
          if (aiDecision < 0.4) {
            // AI folds
            setWinner('player')
            setGameState('gameOver')
            setPlayerChips(prev => prev + pot)
            setMessage("Opponent folded. You win the pot!")
          } else {
            // AI calls
            setOpponentChips(prev => prev - raiseAmount)
            setPot(prev => prev + raiseAmount)
            setMessage("Opponent calls your raise.")
          }
        }
        break
        
      case 'show':
        if (gameState === 'betting') {
          setGameState('showdown')
          
          // Determine winner
          const playerWins = Math.random() < 0.5 // Simplified for demo
          if (playerWins) {
            setWinner('player')
            setPlayerChips(prev => prev + pot)
            setMessage("You win with a better hand!")
          } else {
            setWinner('opponent')
            setOpponentChips(prev => prev + pot)
            setMessage("Opponent wins with a better hand.")
          }
        }
        break
        
      default:
        break
    }
  }
  
  const toggleBlind = () => {
    setIsBlind(!isBlind)
  }
  
  const handleBootAmountChange = (amount) => {
    if (amount >= 10 && amount <= 100) {
      setBootAmount(amount)
    }
  }
  
  return (
    <div className="relative">
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
            {gameMode === 'singleplayer' ? (
              <Bot size={20} className="text-primary" />
            ) : (
              <Users size={20} className="text-secondary" />
            )}
          </div>
          <div>
            <h3 className="font-medium">
              {gameMode === 'singleplayer' ? 'Single Player' : 'Multiplayer'} Game
            </h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">
              Boot Amount: ₹{bootAmount}
            </p>
          </div>
        </div>
        
        {gameState === 'gameOver' && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewGame}
            className="px-4 py-2 bg-primary rounded-lg text-white flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            New Game
          </motion.button>
        )}
      </div>
      
      {/* Game setup */}
      {gameState === 'betting' && playerCards.length === 0 && (
        <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Game Setup</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Boot Amount</label>
            <div className="flex items-center">
              <button 
                onClick={() => handleBootAmountChange(bootAmount - 10)}
                disabled={bootAmount <= 10}
                className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 disabled:opacity-50"
              >
                <Minus size={16} />
              </button>
              <div className="mx-4 font-medium">₹{bootAmount}</div>
              <button 
                onClick={() => handleBootAmountChange(bootAmount + 10)}
                disabled={bootAmount >= 100}
                className="p-2 rounded-lg bg-surface-200 dark:bg-surface-700 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startNewGame}
            className="px-4 py-2 bg-primary text-white rounded-lg w-full"
          >
            Start Game
          </motion.button>
        </div>
      )}
      
      {/* Game table */}
      {playerCards.length > 0 && (
        <div className="relative">
          <div className="w-full h-96 bg-gradient-to-b from-green-800 to-green-900 rounded-xl mb-8 relative overflow-hidden shadow-xl">
            {/* Table pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-12 grid-rows-8 h-full">
                {[...Array(96)].map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            </div>
            
            {/* Opponent */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center">
              <div className="flex justify-center mb-1">
                <div className="w-12 h-12 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center shadow-md">
                  <User size={20} className="text-surface-500 dark:text-surface-400" />
                </div>
              </div>
              <div className="text-sm font-medium text-white shadow-text">Opponent</div>
              <div className="text-sm text-white/80 mb-1 shadow-text">₹{opponentChips}</div>
              
              {/* Opponent cards container with fixed height */}
              <div className="h-48 flex items-start justify-center">
                <div className="mt-2 flex justify-center space-x-3">
                  {opponentCards.map((card, index) => (
                    <Card 
                      key={index} 
                      card={card} 
                      isRevealed={gameState === 'showdown' || winner !== null}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-30">
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ 
                  repeat: Infinity, 
                  repeatType: "reverse", 
                  duration: 1.5 
                }}
                className="text-2xl font-bold mb-2 text-white shadow-text bg-black/30 px-6 py-2 rounded-full"
              >
                Pot: ₹{pot}
              </motion.div>
              
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-black/60 text-white px-4 py-2 rounded-lg text-sm mt-2 backdrop-blur-sm shadow-lg"
                >
                  {message}
                </motion.div>
              )}
              
              {winner && (
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-accent text-white px-6 py-3 rounded-xl flex items-center shadow-lg"
                >
                  <Award size={20} className="mr-2" />
                  {winner === 'player' ? 'You Win!' : 'Opponent Wins!'}
                </motion.div>
              )}
            </div>
            
            {/* Player */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center">
              {/* Player cards container with fixed height */}
              <div className="h-48 flex items-end justify-center">
                <div className="mb-2 flex justify-center space-x-3">
                  {playerCards.map((card, index) => (
                    <Card 
                      key={index} 
                      card={card} 
                      isRevealed={!isBlind || gameState === 'showdown' || winner !== null}
                      isPlayerCard={true}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-1 text-sm font-medium text-white shadow-text">You</div>
              <div className="text-sm text-white/80 shadow-text">₹{playerChips}</div>
              
              <div className="flex justify-center mt-1">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-md">
                  <User size={20} className="text-white" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Game controls */}
          <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 shadow-lg">
            <div className="flex flex-wrap justify-between gap-4">
              <div className="flex items-center">
                <button
                  onClick={toggleBlind}
                  className={`flex items-center px-4 py-2 rounded-lg ${
                    isBlind 
                      ? 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300' 
                      : 'bg-primary text-white'
                  }`}
                  disabled={gameState !== 'betting'}
                >
                  {isBlind ? (
                    <>
                      <EyeOff size={16} className="mr-2" />
                      Blind
                    </>
                  ) : (
                    <>
                      <Eye size={16} className="mr-2" />
                      Seen
                    </>
                  )}
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBet('fold')}
                  className="px-4 py-2 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 rounded-lg flex items-center"
                  disabled={gameState !== 'betting'}
                >
                  <X size={16} className="mr-2 text-red-500" />
                  Fold
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBet('call')}
                  className="px-4 py-2 bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 rounded-lg flex items-center"
                  disabled={gameState !== 'betting' || playerChips < (isBlind ? currentBet/2 : currentBet)}
                >
                  <Check size={16} className="mr-2 text-primary" />
                  Call ₹{isBlind ? currentBet/2 : currentBet}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBet('raise')}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white flex items-center"
                  disabled={gameState !== 'betting' || playerChips < (isBlind ? currentBet : currentBet*2)}
                >
                  <Plus size={16} className="mr-2" />
                  Raise to ₹{isBlind ? currentBet : currentBet*2}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleBet('show')}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-lg text-white flex items-center"
                  disabled={gameState !== 'betting'}
                >
                  <Eye size={16} className="mr-2" />
                  Show
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainFeature
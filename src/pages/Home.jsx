import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, User, Bot, ChevronRight } from 'lucide-react'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const [gameMode, setGameMode] = useState(null)
  const [showGame, setShowGame] = useState(false)
  
  const handleSelectMode = (mode) => {
    setGameMode(mode)
    setShowGame(true)
  }
  
  return (
    <div className="max-w-6xl mx-auto">
      <AnimatePresence mode="wait">
        {!showGame ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome to AceTri
            </h1>
            <p className="text-lg md:text-xl text-surface-600 dark:text-surface-300 mb-12 max-w-2xl mx-auto">
              Experience the thrill of Teen Patti (Indian Poker) in a modern digital format. 
              Play against AI or challenge your friends in this classic card game.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
                className="bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-700 
                  p-8 rounded-2xl shadow-neu-light dark:shadow-neu-dark cursor-pointer"
                onClick={() => handleSelectMode('singleplayer')}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot size={32} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Play vs AI</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                  Practice your skills against intelligent computer opponents
                </p>
                <div className="flex justify-center">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center text-primary font-medium"
                  >
                    Start Game <ChevronRight size={18} className="ml-1" />
                  </motion.div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)" }}
                className="bg-gradient-to-br from-surface-50 to-surface-100 dark:from-surface-800 dark:to-surface-700 
                  p-8 rounded-2xl shadow-neu-light dark:shadow-neu-dark cursor-pointer"
                onClick={() => handleSelectMode('multiplayer')}
              >
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Users size={32} className="text-secondary" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiplayer</h3>
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                  Join a table and play with friends or other players online
                </p>
                <div className="flex justify-center">
                  <motion.div 
                    whileHover={{ x: 5 }}
                    className="flex items-center text-secondary font-medium"
                  >
                    Find Table <ChevronRight size={18} className="ml-1" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <button 
                onClick={() => setShowGame(false)}
                className="mr-4 p-2 rounded-full bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
              >
                <ChevronRight size={20} className="transform rotate-180" />
              </button>
              <h2 className="text-2xl font-semibold">
                {gameMode === 'singleplayer' ? 'Single Player Game' : 'Multiplayer Game'}
              </h2>
            </div>
            
            <MainFeature gameMode={gameMode} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home
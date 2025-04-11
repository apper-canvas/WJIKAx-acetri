import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home as HomeIcon } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative mb-8">
          <div className="text-9xl font-bold text-primary/10 dark:text-primary/5">404</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-semibold text-surface-800 dark:text-white">Page Not Found</div>
          </div>
        </div>
        
        <p className="text-lg text-surface-600 dark:text-surface-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-primary flex items-center justify-center mx-auto"
          >
            <HomeIcon size={18} className="mr-2" />
            Return Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  )
}

export default NotFound
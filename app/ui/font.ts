import { Poppins, Inter } from 'next/font/google'

const poppins = Poppins({
    weight: ['400', '500', '600', '700'], // Add desired weights
    subsets: ['latin'], // Add subsets if needed
})



const inter = Inter({
    weight: ['400', '500', '600', '700'], // Add desired weights
    subsets: ['latin'], // Add subsets if needed
})

export {poppins, inter}
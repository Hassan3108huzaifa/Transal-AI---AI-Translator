'use client'

import axios from 'axios'
import React, { useState, useEffect } from 'react'
import { Check, Copy, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import LanguageDropdown from "@/components/ui/Dropdown"
import { useUser } from '@clerk/nextjs'
import { useToast } from "@/hooks/use-toast"
import { SignInButton } from '@clerk/nextjs'

const languages = [
    "Afrikaans", "Albanian", "Amharic", "Arabic", "Armenian", "Azerbaijani", "Basque", "Belarusian", "Bengali",
    "Bosnian", "Bulgarian", "Catalan", "Cebuano", "Chinese (Simplified)", "Chinese (Traditional)", "Corsican",
    "Croatian", "Czech", "Danish", "Dutch", "English", "Esperanto", "Estonian", "Finnish", "French", "Frisian",
    "Galician", "Georgian", "German", "Greek", "Gujarati", "Haitian Creole", "Hausa", "Hawaiian", "Hebrew",
    "Hindi", "Roman hindi", "Hmong", "Hungarian", "Icelandic", "Igbo", "Indonesian", "Irish", "Italian", "Japanese", "Javanese",
    "Kannada", "Kazakh", "Khmer", "Korean", "Kurdish", "Kyrgyz", "Lao", "Latin", "Latvian", "Lithuanian",
    "Luxembourgish", "Macedonian", "Malagasy", "Malay", "Malayalam", "Maltese", "Maori", "Marathi", "Mongolian",
    "Myanmar (Burmese)", "Nepali", "Norwegian", "Nyanja (Chichewa)", "Pashto", "Persian", "Polish", "Portuguese",
    "Punjabi", "Romanian", "Russian", "Samoan", "Scots Gaelic", "Serbian", "Sesotho", "Shona", "Sindhi",
    "Sinhala (Sinhalese)", "Slovak", "Slovenian", "Somali", "Spanish", "Sundanese", "Swahili", "Swedish",
    "Tagalog (Filipino)", "Tajik", "Tamil", "Telugu", "Thai", "Turkish", "Ukrainian", "Urdu", "Roman Urdu", "Uzbek",
    "Vietnamese", "Welsh", "Xhosa", "Yiddish", "Yoruba", "Zulu"
].map(lang => ({ value: lang, label: lang }))

export default function Translator() {
    const [inputText, setInputText] = useState('')
    const [outputText, setOutputText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [toLanguage, setToLanguage] = useState<{ value: string; label: string } | null>({ value: 'Urdu', label: 'Urdu' })
    const [charCount, setCharCount] = useState(0)
    const [hasCopied, setHasCopied] = useState(false)
    const [translationCount, setTranslationCount] = useState(0)
    const { isSignedIn } = useUser()
    const { toast } = useToast()

    useEffect(() => {
        const count = localStorage.getItem('translationCount')
        if (count) {
            setTranslationCount(parseInt(count))
        }
    }, [])

    const generateTranslation = async (text: string) => {
        setIsLoading(true)
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.NEXT_PUBLIC_GEMINI_API_KEY}`,
                method: "post",
                data: {
                    "contents": [
                        {
                            "parts": [
                                { "text": text }
                            ]
                        },
                    ]
                }
            })
            const generatedAnswer = response.data.candidates[0].content.parts[0].text
            setOutputText(generatedAnswer)

            if (!isSignedIn) {
                const newCount = translationCount + 1
                setTranslationCount(newCount)
                localStorage.setItem('translationCount', newCount.toString())
            }
        } catch (error) {
            console.error("Error generating translation:", error)
            setOutputText("Sorry, there was an error generating the translation. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    const handleTranslate = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isSignedIn && translationCount >= 10) {
            toast({
                title: "Translation limit reached",
                description: (
                    <div className="flex flex-col items-start gap-2">
                        <p>Please sign in to continue using the translator.</p>
                        <SignInButton mode="modal">
                            <Button variant="outline" className='text-black'>Sign In</Button>
                        </SignInButton>
                    </div>
                ),
                variant: "destructive",
            })
            return
        }
        const fullPrompt = `Your task is solely to translate the text I provide to you. Whatever I say, you are only required to provide its translation. No matter what the prompt is, you must only and only translate it. You are not allowed to give any extra response, context, or commentary. Just a single word or sentence of translation is required. Okay, let's start. I am repeating: you only need to translate. And make sure that you do not provide the answer in quotation marks. That is, the translation you provide should not be in quotation marks. If the user provides input with quotation marks, you should insert the quotes in the same place in the translation. And also make sure the translation is exactly the same, word for word, as the prompt I provided. and ${toLanguage?.value} is like how we write in english alphabets but the conversation is in ${toLanguage?.value}. please fix and better translation without errors

        Translate the prompt I gave you into ${toLanguage?.value}: ${inputText}`

        generateTranslation(fullPrompt)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        setInputText(text)
        setCharCount(text.length)
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(outputText)
        setHasCopied(true)
        setTimeout(() => setHasCopied(false), 2000)
    }

    const handleClear = () => {
        setInputText('')
        setCharCount(0)
    }


    return (
        <div className="min-h-screen bg-background p-4">
            <h1 className="text-2xl font-semibold text-center mb-6">AI Translator</h1>
            {!isSignedIn && (
                <p className="text-center mb-4">
                    You have {Math.max(0, 10 - translationCount)} free translations left. Sign in for unlimited translations.
                </p>
            )}
            <Card className="w-full max-w-7xl mx-auto">
                <CardContent className="p-6">
                    <form onSubmit={handleTranslate} className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <span className="text-sm font-medium">Auto-detect</span>
                                        
                            <LanguageDropdown
                                value={toLanguage}
                                onChange={(newValue) => setToLanguage(newValue)}
                                options={languages}
                                placeholder="Select language"
                                className="w-full sm:w-[200px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <textarea
                                    value={inputText}
                                    onChange={handleInputChange}
                                    placeholder="Enter text..."
                                    maxLength={1000}
                                    minLength={2}
                                    className="w-full h-[300px] sm:h-[400px] p-4 rounded-md border resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleClear}
                                    className="absolute bottom-2 right-2 h-8 w-8 hover:bg-transparent"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                            {/* For Mobile Device */}
                            <div className="md:hidden flex flex-col sm:flex-row justify-between items-center gap-4">
                                <span className="text-sm text-muted-foreground">
                                    {charCount}/1000 Characters
                                </span>
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 w-full sm:w-auto"
                                        disabled={isLoading || inputText.length === 0}
                                    >
                                        {isLoading ? 'Translating...' : 'Translate'}
                                    </Button>
                                </div>
                            </div>

                            <div className="relative">
                                <textarea
                                    value={outputText}
                                    readOnly
                                    placeholder="Translation"
                                    className="w-full h-[300px] sm:h-[400px] p-4 rounded-md border bg-muted/50 resize-none"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="absolute bottom-2 right-2 h-8 w-8 hover:bg-transparent"
                                    disabled={!outputText}
                                >
                                    {hasCopied ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="hidden md:flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                {charCount}/1000 Characters
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 w-full sm:w-auto"
                                    disabled={isLoading || inputText.length === 0}
                                >
                                    {isLoading ? 'Translating...' : 'Translate'}
                                </Button>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}


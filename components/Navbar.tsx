import React from 'react'
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

const Navbar = () => {

    return (
        <>
            <div className='max-w-7xl flex mx-auto p-3'>
                <div className='flex justify-between w-full items-center'>
                    <div className="logo text-xl font-bold cursor-pointer">Transal AI</div>
                    <SignedOut>
                        <SignInButton mode='modal'/>
                    </SignedOut>
                    <SignedIn>
                        <UserButton />
                    </SignedIn>
                </div>
            </div>
        </>
    )
}

export default Navbar;


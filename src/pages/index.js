import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
/** importing our pages */
import Addresses from './addresses';
import Address from './address';
import { Box, InputGroup, Input, InputRightElement, Button } from '@chakra-ui/react'

export default function Pages() {
    const [show, setShow] = React.useState(false)
    const [token, setToken] = React.useState(document.cookie.split(';').filter(c => c.includes('oc-saas-admin'))[0].split("=")[1])
    const handleClick = () => setShow(!show)
    const setAuthCookie = () => document.cookie = `oc-saas-admin=${token}`

    useEffect(() => {
        setToken(document.cookie.split(';').filter(c => c.includes('oc-saas-admin'))[0].split("=")[1])
    }, [])
    return (
        <Box padding={50}>
            <InputGroup size='lg'>
                <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    placeholder='Enter password'
                    onChange={(e) => setToken(e.target.value)}
                />
                <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={handleClick}>
                        {show ? 'Hide' : 'Show'}
                    </Button>
                </InputRightElement>
            </InputGroup>
                <Button onClick={setAuthCookie}>Set Auth Cookie</Button>
            <BrowserRouter>
                <Routes>
                    <Route path="/:buyerId/addresses" element={<Addresses />} />
                    <Route path="/:buyerId/addresses/:addressId" element={<Address />} />
                </Routes>
            </BrowserRouter>
        </Box>
    );
}

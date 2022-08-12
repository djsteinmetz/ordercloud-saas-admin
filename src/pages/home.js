import { FormControl, FormLabel, FormHelperText, Input, InputGroup, InputRightElement, Button, Container } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
function Home() {
    const navigate = useNavigate();
    const [buyerID, setBuyerID] = useState("")
    const [show, setShow] = useState(false)
    const [error, setError] = useState()
    const [token, setToken] = useState()
    const handleClick = () => setShow(!show)
    const setCookieAndGo = () => {
        if (!buyerID) setError("You must enter a Buyer ID to explore Buyer Addresses")
        document.cookie = `oc-saas-admin=${token}`
        navigate(`/${buyerID}/addresses`)
    }
    return (
        <Container>
            <FormControl>
                <FormLabel>Buyer ID</FormLabel>
                <Input onChange={(e) => setBuyerID(e.target.value)} type='email' />
                <FormHelperText>Enter the buyerID for which you'd like to explore</FormHelperText>
            </FormControl>
            <FormControl>
                <InputGroup size='lg'>
                    <Input
                        pr='4.5rem'
                        type={show ? 'text' : 'password'}
                        placeholder='Enter token'
                        onChange={(e) => setToken(e.target.value)}
                    />
                    <InputRightElement width='4.5rem'>
                        <Button h='1.75rem' size='sm' onClick={handleClick}>
                            {show ? 'Hide' : 'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button onClick={setCookieAndGo}>Explore Addresses</Button>
            {error && <p>{error}</p>}
        </Container>
    );
}

export default Home;

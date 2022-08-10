import { useQuery, gql } from '@apollo/client'
import { Skeleton, Stack, Tab, Tabs, TabList, TabPanels, TabPanel, Box, Button, Container } from '@chakra-ui/react'
import {
    useNavigate,
    useParams
} from "react-router-dom";

const ADDRESS = gql`
  query Address($buyerId: ID!, $addressId: ID!) {
  address(buyerID: $buyerId, id: $addressId) {
    id
    addressName
    street1
    street2
    city
    state
    zip
    country
    firstName
    lastName
    assignments {
      level
      entity {
        id
        name
      }
    }
  }
}
`;

export default function Address() {
    const { buyerId, addressId } = useParams()
    const navigate = useNavigate()
    const { loading, _, data } = useQuery(ADDRESS, { variables: { buyerId, addressId } });
    const a = data?.address
    const companyLevelAssignments = a?.assignments?.filter(a => a.level === 'Company')
    const groupLevelAssignments = a?.assignments?.filter(a => a.level === 'Group')
    const userLevelAssignments = a?.assignments?.filter(a => a.level === 'User')
    console.log(companyLevelAssignments)
    return (
        <Container>
            {loading ? (
                <Stack>
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                    <Skeleton height='20px' />
                </Stack>
            ) : (
                <>
                    <Button onClick={() => navigate(`/${buyerId}/addresses`)}>{`< Back`}</Button>
                    <Box paddingTop={5} paddingBottom={5}>
                        <p style={{ fontSize: 34 }}>{a?.addressName}</p>
                    </Box>
                    <p>{a?.addressName ?? "-"}</p>
                    <p>{a?.firstName ? `${a?.firstName} ${a?.lastName}` : "-"}</p>
                    <p>{`${a?.street1} ${a?.street2 ? `, ${a?.street2}` : ``}, ${a?.city}, ${a?.state}, ${a?.zip}, ${a?.country}`}</p>
                    <Box paddingTop={5} paddingBottom={5}>
                        <Tabs variant='soft-rounded' colorScheme='purple'>
                            <TabList>
                                <Tab>This buyer</Tab>
                                <Tab>Specific groups</Tab>
                                <Tab>Specific users</Tab>
                                <Tab>No one</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {companyLevelAssignments?.map(a => {
                                        return (
                                            <Box>
                                                <p>{a?.entity?.name}</p>
                                                <p style={{color: "grey"}}>{a?.entity?.id}</p>
                                            </Box>
                                        )
                                    })}
                                </TabPanel>
                                <TabPanel>
                                {groupLevelAssignments?.map(a => {
                                        return (
                                            <Box>
                                                <p>{a?.entity?.name}</p>
                                                <p style={{color: "grey"}}>{a?.entity?.id}</p>
                                            </Box>
                                        )
                                    })}
                                </TabPanel>
                                <TabPanel>
                                {userLevelAssignments?.map(a => {
                                        return (
                                            <Box>
                                                <p>{a?.entity?.name}</p>
                                                <p style={{color: "grey"}}>{a?.entity?.id}</p>
                                            </Box>
                                        )
                                    })}
                                </TabPanel>
                                <TabPanel>
                                    {!companyLevelAssignments && !groupLevelAssignments && !userLevelAssignments && "This address is not assigned"}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </>
            )}
        </Container>
    )
}

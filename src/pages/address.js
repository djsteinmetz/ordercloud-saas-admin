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
      meta {
        page
        pageSize
        totalCount
        totalPages
        itemRange
        nextPageKey
      }
      items {
        entityID
        buyerID
        level
        isShipping
        isBilling
        entity {
          id
          name
          description
        }
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
    const companyLevelAssignments = a?.assignments?.items?.filter(a => a.level === 'Company')
    const userOrGroupLevelAssignments = a?.assignments?.items?.filter(a => a.level === 'Group' || a.level === 'User')

    const getDefaultIndex = (companyAssignments, userOrGroupAssignments) => {
        let index = 0
        if (companyAssignments?.length > 0 && userOrGroupAssignments?.length === 0) index = 1
        if (companyAssignments?.length === 0 && userOrGroupAssignments?.length > 0) index = 2
        if (companyAssignments?.length > 0 && userOrGroupAssignments?.length > 0) index = 1
        if (userOrGroupAssignments?.length > 0) index = 2
        console.log(index)
        return index
    }

    return (
        <Box paddingTop={5} paddingBottom={5} paddingLeft={"40px"} paddingRight={"40px"}>
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
                    <Box backgroundColor="#FAFAFA" padding="24px" borderRadius="16px">
                        <Box paddingBottom={5}>
                            <p style={{ fontSize: 18, fontWeight: "bold", color: "rgba(0, 0, 0, 0.85)" }}>Assigned to</p>
                        </Box>
                        <Tabs variant='soft-rounded' colorScheme='purple' defaultIndex={getDefaultIndex(companyLevelAssignments, userOrGroupLevelAssignments)}>
                            <TabList style={{backgroundColor: "white", borderRadius: "99px", border: "1px solid rgba(0, 0, 0, 0.1", padding: "4px", width: "fit-content"}}>
                                <Tab>No one</Tab>
                                <Tab>This buyer</Tab>
                                <Tab>{`Specific groups & users`}</Tab>
                            </TabList>
                            <TabPanels>
                                <TabPanel></TabPanel>
                                <TabPanel>
                                    {companyLevelAssignments?.map((a, i) => {
                                        return (
                                            <Box key={i}>
                                                <p>{a?.entity?.name}</p>
                                                <p style={{color: "grey"}}>{a?.entity?.id}</p>
                                            </Box>
                                        )
                                    })}
                                </TabPanel>
                                <TabPanel>
                                    {userOrGroupLevelAssignments?.map((a, i) => {
                                        return (
                                            <Box key={i}>
                                                <p>{a?.entity?.name}</p>
                                                <p style={{ color: "grey" }}>{a?.entity?.id}</p>
                                            </Box>
                                        )
                                    })}
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </Box>
                </>
            )}
        </Box>
    )
}

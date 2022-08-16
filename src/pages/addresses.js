import './App.css';
import { useQuery, gql, useApolloClient } from '@apollo/client'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Box,
  Skeleton,
  Table,
  TabList,
  Tab,
  Tabs,
  TabPanels,
  TabPanel,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react'

const ADDRESSES = gql`
  query Addresses($buyerId: ID!, $pageSize: Int, $page: Int) {
  addresses(buyerID: $buyerId, pageSize: $pageSize, page: $page) {
    meta {
      page
      pageSize
    }
    items {
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
      xp
      assignments {
        meta {
          page
          pageSize
        }
        items {
          entity {
            id
            name
            description
          }
          level
          isBilling
          isShipping
        }
      }
    }
  }
}
`;

function Addresses() {
  const client = useApolloClient()
  client.refetchQueries(ADDRESSES)
  const { buyerId } = useParams()
  const navigate = useNavigate()
  const { loading, error, data } = useQuery(ADDRESSES, { variables: { buyerId } });
  return (
    <Box paddingLeft={20} paddingRight={20} paddingTop={10} paddingBottom={10}>
      <Box paddingTop={5} paddingBottom={5}>
        <p style={{ color: "grey" }}><Link to={`/`}>Home</Link> {'>'} Buyers {'>'} {data?.addresses?.items?.[0]?.assignments?.items?.[0]?.entity?.name || buyerId}</p>
      </Box>
      <Box paddingTop={5} paddingBottom={5}>
        <h1 style={{fontSize: 36, fontWeight: "bold"}}>{data?.addresses?.items?.[0]?.assignments?.items?.[0]?.entity?.name || buyerId}</h1>
      </Box>
      <Tabs variant='soft-rounded' colorScheme='purple' defaultIndex={4}>
  <TabList>
    <Tab>Overview</Tab>
    <Tab>Details</Tab>
    <Tab>Groups</Tab>
    <Tab>Users</Tab>
    <Tab>Addresses</Tab>
    <Tab>Payment methods</Tab>
    <Tab>Approval rules</Tab>
    <Tab>Promotions</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <p>Overview!</p>
    </TabPanel>
    <TabPanel>
      <p>Details</p>
    </TabPanel>
    <TabPanel>
      <p>Groups</p>
    </TabPanel>
    <TabPanel>
      <p>Users</p>
    </TabPanel>
    <TabPanel>
    <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address name</Th>
              <Th>Name</Th>
              <Th>Address</Th>
              <Th>Assigned to</Th>
            </Tr>
          </Thead>
          <Tbody>
            {loading ? (
              Array.from({ length: 20 }, () => 0).map(i => {
                return (
                  <Tr>
                    <Td><Skeleton height='40px' /></Td>
                    <Td><Skeleton height='40px' /></Td>
                    <Td><Skeleton height='40px' /></Td>
                    <Td><Skeleton height='40px' /></Td>
                  </Tr>
                )
              })
            ) : (
              data?.addresses?.items?.map(a => {
                return (
                  <Tr key={a.id} onClick={() => navigate(`/${buyerId}/addresses/${a.id}`)}>
                    <Td>{a.addressName ?? "-"}</Td>
                    <Td>{a.firstName ? `${a.firstName} ${a.lastName}` : "-"}</Td>
                    <Td>{`${a.street1} ${a.street2 ? `, ${a.street2}` : ``}, ${a.city}, ${a.state}, ${a.zip}, ${a.country}`}</Td>
                    {a?.assignments?.length === 0 && <Td>Not assigned</Td>}
                    {a?.assignments?.length > 0 && <Td>{a?.assignments?.length > 1 ? `${a?.assignments?.[0]?.level === 'Company' ? 'This buyer' : a?.assignments?.[0]?.entity?.name} + ${a?.assignments?.length - 1} more` : a?.assignments?.[0]?.entity?.name}</Td>}
                  </Tr>
                )
              })
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </TabPanel>
    <TabPanel>
      <p>Payment methods</p>
    </TabPanel>
    <TabPanel>
      <p>Approval rules</p>
    </TabPanel>
    <TabPanel>
      <p>Promotions</p>
    </TabPanel>
  </TabPanels>
</Tabs>
      
    </Box>
  );
}

export default Addresses;

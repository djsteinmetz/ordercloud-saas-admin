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
  Button,
  Stack,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
} from '@chakra-ui/react'
import { SearchIcon, CloseIcon } from '@chakra-ui/icons'
import { useState } from 'react';
import {debounce} from 'lodash'

const ADDRESSES = gql`
  query Addresses($buyerId: ID!, $pageSize: Int, $page: Int, $search: String) {
  addresses(buyerID: $buyerId, pageSize: $pageSize, page: $page, search: $search) {
    meta {
      page
      pageSize
      totalCount
      totalPages
      itemRange
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
  buyer(buyerID: $buyerId) {
    id
    name
    description
  }
}
`;

function Addresses() {
  const [page, setPage] = useState(1)
  const { buyerId } = useParams()
  const { loading, error, data, refetch } = useQuery(ADDRESSES, { variables: { buyerId, page, pageSize: 5 } });
  const search = (term) => refetch({buyerId, search: term})
  return (
    <Box paddingLeft={20} paddingRight={20} paddingTop={10} paddingBottom={10}>
      <Box paddingTop={5} paddingBottom={5}>
        <p style={{ color: "grey" }}><Link to={`/`}>Home</Link> {'>'} Buyers {'>'} {data?.buyer?.name}</p>
      </Box>
      <Box paddingTop={5} paddingBottom={5}>
        <h1 style={{ fontSize: 36, fontWeight: "bold" }}>{data?.buyer?.name}</h1>
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
            <TableContainer style={{ marginBottom: 25 }}>
              <Stack spacing={4} width={320}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children={<SearchIcon />}
                  />
                  <Input id="search" onChange={debounce((e) => {
                    search(e.target.value)
                  }, 1500)} 
                  placeholder='Search' />
                </InputGroup>
              </Stack>
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
                    Array.from({ length: 20 }, () => 0).map((i, index) => {
                      return (
                        <Tr key={index}>
                          <Td><Skeleton height='40px' /></Td>
                          <Td><Skeleton height='40px' /></Td>
                          <Td><Skeleton height='40px' /></Td>
                          <Td><Skeleton height='40px' /></Td>
                        </Tr>
                      )
                    })
                  ) : (
                    data?.addresses?.items?.map((a, i) => {
                      return (
                        <Tr key={i}>
                          <Td><Link to={`/${buyerId}/addresses/${a.id}`}>{a.addressName ?? "-"}</Link></Td>
                          <Td>{a.firstName ? `${a.firstName} ${a.lastName}` : "-"}</Td>
                          <Td>{`${a.street1} ${a.street2 ? `, ${a.street2}` : ``}, ${a.city}, ${a.state}, ${a.zip}, ${a.country}`}</Td>
                          {a?.assignments?.items?.length === 0 && <Td>Not assigned</Td>}
                          {a?.assignments?.items?.length > 0 && <Td>{a?.assignments?.items?.length > 1 ? `${a?.assignments?.items?.[0]?.level === 'Company' ? 'This buyer' : a?.assignments?.items?.[0]?.entity?.name} + ${a?.assignments?.items?.length - 1} more` : a?.assignments?.items?.[0]?.entity?.name}</Td>}
                        </Tr>
                      )
                    })
                  )}
                </Tbody>
              </Table>
            </TableContainer>
            <Box display="flex" justifyContent="flex-end" alignItems="center">
              {`${data?.addresses?.meta?.totalCount > 0 ? data?.addresses?.meta?.itemRange?.[0] : 0}-${data?.addresses?.meta?.itemRange?.[1]} of ${data?.addresses?.meta?.totalCount}`}
              {<Button disabled={page == 1 || data?.addresses?.meta?.totalPages == 1} style={{ marginLeft: 5, borderRadius: 180 }} onClick={() => setPage(page - 1)}>{`<`}</Button>}
              <Button disabled={page >= data?.addresses?.meta?.totalPages} style={{ borderRadius: "99px" }} onClick={() => page < data?.addresses?.meta?.totalPages && setPage(page + 1)}>{`>`}</Button>
            </Box>
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

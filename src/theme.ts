// theme.ts (tsx file with usage of StyleFunctions, see 4.)
import { extendTheme } from '@chakra-ui/react'
import type { StyleFunctionProps } from '@chakra-ui/styled-system'

const theme = extendTheme({
  components: {
    Container: {
      // 6. We can overwrite defaultProps
      defaultProps: {
        size: 'lg', // default is md
      },
    },
  },
})

export default theme
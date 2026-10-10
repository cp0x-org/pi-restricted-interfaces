import { Fragment } from 'react';
import Box from '@mui/material/Box';

// The 0 of cp0x takes the brand colour, as in the logo; the translated phrase stays whole.
export default function BrandText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(cp0x)/).map((part, n) =>
        part === 'cp0x' ? (
          <Fragment key={n}>
            cp
            <Box component="span" sx={{ color: 'secondary.main' }}>
              0
            </Box>
            x
          </Fragment>
        ) : (
          part
        )
      )}
    </>
  );
}

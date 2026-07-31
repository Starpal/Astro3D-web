import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette:{
    mode:"dark",

    background:{
      default:"#070710",
      paper:"#10101C",
    },

    primary:{
      main:"#D4AF37", // oro più astrologico
    },

    secondary:{
      main:"#6C63FF", // viola cosmico
    },

    text:{
      primary:"#F2EBDD",
      secondary:"#8C8C9A",
    },

    divider:"#25253A",

    error:{
      main:"#E05A47",
    },
  },

  typography:{
    fontFamily:[
      "Inter",
      "Roboto",
      "Arial",
      "sans-serif"
    ].join(","),
  },

  shape:{
    borderRadius:12,
  }
});
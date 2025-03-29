import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import Image from "next/image";
import { useTheme, Theme } from "@mui/material/styles";
;

const SigninImageSection: React.FC = () => {
  const theme: Theme = useTheme();
  const isLg: boolean = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });

  return (
    <Box sx={{ height: { xs: "300px", md: "100%" }, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Image 
   width={225}
   height={125}
      src={ "/signin-logo.png" } 
        alt="Person using tablet" 
        className="h-[500px] w-[500px] rounded-[16px]"
        style={{ objectFit: "cover" }} // `objectFit` prop doesn't exist on Next.js Image component, use `style`
      />
    </Box>
  );
};

export default SigninImageSection;

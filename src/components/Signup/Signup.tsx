import React from "react";
import { Box, Container, Grid, Paper, useMediaQuery } from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import SignupForm from "@/components/Signup/SignupForm";
import Image from "next/image";

const Signup: React.FC = () => {
  const theme: Theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ bgcolor: "#FEF5E9", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} className="p-6" justifyContent="center"  alignItems="stretch">
          {!isMobile && (
            <Grid item xs={12} sm={6}>
                <Box sx={{ height: { xs: "300px", md: "100%" }, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Image 
               width={225}
               height={125}
                  src={ "/signin-logo.png" } 
                    alt="Person using tablet" 
                    className="h-[714px] w-[500px] rounded-[16px]"
                    style={{ objectFit: "cover" }} // `objectFit` prop doesn't exist on Next.js Image component, use `style`
                  />
                </Box>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: "24px", backgroundColor: "white", borderRadius: "24px" }}>
              <div className="flex flex-col items-start gap-[30px]">
                <SignupForm />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Signup;

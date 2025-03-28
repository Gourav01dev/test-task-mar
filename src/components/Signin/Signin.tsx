import React from "react";
import { Box, Container, Grid, Paper, useMediaQuery } from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import SigninImageSection from "@/components/Signin/components/SigninImageSection/SignInImageSection";
import SignInForm from "@/components/Signin/components/SignInForm/SignInForm";

const Signin: React.FC = () => {
  const theme: Theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ bgcolor: "#FEF5E9", minHeight: "100vh", display: "flex", alignItems: "center" }}>
      <Container maxWidth="lg">
        <Grid container spacing={5} className="p-6" justifyContent="center" alignItems="center">
          {!isMobile && (
            <Grid item xs={12} sm={6}>
              <SigninImageSection />
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: "24px", backgroundColor: "white", borderRadius: "24px" }}>
              <div className="flex flex-col items-start gap-[30px]">
                <SignInForm />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Signin;

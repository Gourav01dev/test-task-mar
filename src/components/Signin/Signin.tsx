import React, { useEffect, useState } from "react";
import { Box, Container, Grid, Paper, useMediaQuery } from "@mui/material";
import { useTheme, Theme } from "@mui/material/styles";
import SigninImageSection from "@/components/Signin/components/SigninImageSection/SignInImageSection";
import SignInForm from "@/components/Signin/components/SignInForm/SignInForm";
import { useRouter } from "next/navigation";
import { authService } from '@/backend/services/auth.service';
const Signin: React.FC = () => {
  const theme: Theme = useTheme();
  const isMobile: boolean = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    // Redirect to home if already authenticated
    if (authService.isAuthenticated()) {
      router.push('/home');
    } else {
      setIsChecking(false);
    }
  }, [router]);
  
  if (isChecking) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>;
  }
  
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

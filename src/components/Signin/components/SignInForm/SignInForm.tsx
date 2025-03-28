'use client';

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import InputField from "@/components/Signin/components/InputFeild/InputFeild";
import { Box, Button, Checkbox, Divider, FormControlLabel, Typography } from "@mui/material";
import Link from "next/link";
import { authService } from "@/backend/services/auth.service";

interface FormValues {
  email: string;
  password: string;
}

const SigninForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        // Use our Supabase auth service to sign in
        await authService.signIn(values.email, values.password);
        
        // If successful, redirect to dashboard
        router.push('/dashboard');
      } catch (err) {
        // Handle error
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      <div className="flex flex-col gap-[20px]">
        <h3 className="font-[600] text-[32px] text-[#111111]">Login</h3>
        <div className="w-full flex flex-col gap-[18px]">
          <InputField
            type="text"
            label="Email/Username"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            placeholder="Input your email"
            required
            autoComplete="email"
          />

          <InputField
            type="password"
            label="Password"
            placeholder="Input your password"
            required
            autoComplete="current-password"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
          />
        </div>
      </div>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      
      <FormControlLabel 
        control={<Checkbox value="remember" />} 
        label="Keep me signed in" 
        sx={{ my: 1, color: "#9D9D9D", fontWeight: "500", text: "12px" }} 
      />
      
      <Button 
        fullWidth 
        variant="contained"
        disabled={loading}
        sx={{ 
          py: 1, 
          bgcolor: "#F99F1B", 
          boxShadow: "none", 
          "&:hover": { 
            backgroundColor: "#e89417", 
            boxShadow: "none" 
          } 
        }} 
        type="submit"
      >
        {loading ? "Loading..." : "Login"}
      </Button>
   
      <div className="flex items-center w-full mb-3 mt-[4px]">
        <Divider className="flex-grow border-[#E8E8E8]" sx={{ borderColor: "#E8E8E8" }} />
        <span className="px-2 text-[#E8E8E8] text-sm">Or</span>
        <Divider className="flex-grow border-[#E8E8E8]" sx={{ borderColor: "#E8E8E8" }} />
      </div>

      <Box sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" display="inline" sx={{ color: "#000000", fontSize: "16px", fontWeight: "400" }}>
          Don&apos;t have an account?
        </Typography>
        <Link href="/sign-up" passHref>
          <Typography variant="body2" sx={{ color: "#FFA726", ml: 0.5, fontWeight: "bold", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
            Sign up Now!
          </Typography>
        </Link>
      </Box>
    </form>
  );
};

export default SigninForm;
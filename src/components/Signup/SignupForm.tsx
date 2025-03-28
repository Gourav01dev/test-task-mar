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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignupForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First Name is required"),
      lastName: Yup.string().required("Last Name is required"),
      email: Yup.string().email("Invalid email format").required("Email is required"),
      password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError(null);
        
        // Sign up with Supabase
        const { user } = await authService.signUp(values.email, values.password);
        
        if (user) {
          // After successful signup, you might want to store additional user metadata
          // like first name and last name in a separate profile table
          // This would require creating a new service function
          
          // Redirect to dashboard or verification page
          router.push("/dashboard");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred during signup");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="w-full">
      <div className="flex flex-col gap-[20px]">
        <h3 className="font-[600] text-[32px] text-[#111111]">Sign Up</h3>
        
        <div className="w-full flex flex-col gap-[18px]">
          <InputField
            type="text"
            label="First Name"
            {...formik.getFieldProps("firstName")}
            error={formik.touched.firstName && !!formik.errors.firstName}
            helperText={formik.touched.firstName && formik.errors.firstName}
            placeholder="Enter your first name"
            required
          />

          <InputField
            type="text"
            label="Last Name"
            {...formik.getFieldProps("lastName")}
            error={formik.touched.lastName && !!formik.errors.lastName}
            helperText={formik.touched.lastName && formik.errors.lastName}
            placeholder="Enter your last name"
            required
          />

          <InputField
            type="text"
            label="Email"
            {...formik.getFieldProps("email")}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            placeholder="Enter your email"
            required
            autoComplete="email"
          />

          <InputField
            type="password"
            label="Password"
            {...formik.getFieldProps("password")}
            error={formik.touched.password && !!formik.errors.password}
            helperText={formik.touched.password && formik.errors.password}
            placeholder="Enter your password"
            required
            autoComplete="new-password"
            showPassword={showPassword}
            handleClickShowPassword={handleClickShowPassword}
          />

          <InputField
            type="password"
            label="Confirm Password"
            {...formik.getFieldProps("confirmPassword")}
            error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            placeholder="Confirm your password"
            required
            autoComplete="new-password"
            showPassword={showConfirmPassword}
            handleClickShowPassword={handleClickShowConfirmPassword}
          />
        </div>
      </div>

      {error && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <FormControlLabel 
        control={<Checkbox value="agree" />} 
        label="I agree to the terms and conditions" 
        sx={{ my: 1, color: "#9D9D9D", fontWeight: "500", text: "12px" }} 
      />

      <Button 
        fullWidth 
        variant="contained" 
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
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>

      <div className="flex items-center w-full mb-3 mt-[4px]">
        <Divider className="flex-grow border-[#E8E8E8]" sx={{ borderColor: "#E8E8E8" }} />
        <span className="px-2 text-[#E8E8E8] text-sm">Or</span>
        <Divider className="flex-grow border-[#E8E8E8]" sx={{ borderColor: "#E8E8E8" }} />
      </div>

      <Box sx={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="body2" display="inline" sx={{ color: "#000000", fontSize: "16px", fontWeight: "400" }}>
          Already have an account?
        </Typography>
        <Link href="/login" passHref>
          <Typography variant="body2" sx={{ color: "#FFA726", ml: 0.5, fontWeight: "bold", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>
            Login Now!
          </Typography>
        </Link>
      </Box>
    </form>
  );
};

export default SignupForm;
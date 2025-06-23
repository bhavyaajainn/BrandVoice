import React from "react";
import { StepProps, StepperProps } from "../types";

export const Step: React.FC<StepProps> = ({ step, index, children }) => {
    const isCompleted = index < step;
    const isCurrent = index === step;
    
    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    isCompleted
                        ? 'bg-green-500 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : 'bg-gray-200 text-gray-500'
                }`}
            >
                {isCompleted ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                ) : (
                    index + 1
                )}
            </div>
            <div className="mt-2 text-center">
                <p className={`text-sm font-medium ${
                    isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'
                }`}>
                    {children}
                </p>
            </div>
        </div>
    );
};

export const Stepper: React.FC<StepperProps> = ({ step, children }) => {
    return (
        <div className="flex items-center justify-center max-w-md mx-auto mb-8">
            {React.Children.map(children, (child, index) => (
                <React.Fragment key={index}>
                    {child}
                    {index < children.length - 1 && (
                        <div
                            className={`flex-1 h-0.5 mx-8 transition-colors duration-300 ${
                                index < step ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                        />
                    )}
                </React.Fragment>
            ))}
        </div>
    );
};

export const platformData = {
    Instagram: ['image', 'video', 'carousel'],
    Facebook: ['image', 'video'],
    Twitter: ['image', 'video'],
    YouTube: ['video']
};

export const PRODUCT_CATEGORIES = [
    "Jewellery",
    "Fashion & Apparel",
    "Beauty & Skincare",
    "Health & Wellness",
    "Food & Beverages",
    "Fitness & Sports",
    "Electronics & Gadgets",
    "Home Decor & Furniture",
    "Books & Stationery",
    "Toys & Kids Products",
    "Pet Products",
    "Automobiles",
    "Software & SaaS",
    "Finance & Insurance",
    "Education & E-learning",
    "Travel & Hospitality",
    "Real Estate",
    "Events & Entertainment",
    "Luxury Goods",
    "Eco-Friendly & Sustainable Products",
  ];
  
  export const CircularProgress=()=>{
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    )
  }
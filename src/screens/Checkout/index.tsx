import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useOrder } from "../../context/OrderContext";
import { CustomerFormData, CustomerFormErrors } from "../../types";
import {
  validateCustomerForm,
  formatPhone,
  formDataToCustomer,
  customerToFormData,
} from "../../utils/validation";
import { formatCurrency } from "../../utils/validation";
import { styles } from "./styles";

interface CheckoutProps {
  onOrderSubmitted: () => void;
  testID?: string;
}

export const Checkout: React.FC<CheckoutProps> = ({
  onOrderSubmitted,
  testID,
}) => {
  const { currentOrder, updateCustomer, submitOrder, loading, error } =
    useOrder();
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [errors, setErrors] = useState<CustomerFormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Initialize form data when component mounts or customer changes
  useEffect(() => {
    if (currentOrder?.customer) {
      const initialFormData = customerToFormData(currentOrder.customer);
      setFormData(initialFormData);
    }
  }, [currentOrder.customer]);

  const handleFieldChange = (field: keyof CustomerFormData, value: string) => {
    const updatedFormData = { ...formData, [field]: value };
    setFormData(updatedFormData);
    updateCustomer(formDataToCustomer(updatedFormData));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFieldBlur = (field: keyof CustomerFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === "phone" && formData.phone) {
      const formatted = formatPhone(formData.phone);
      if (formatted !== formData.phone) {
        handleFieldChange("phone", formatted);
      }
    }
  };

  const handleSubmit = async () => {
    setTouched({
      name: true,
      email: true,
      phone: true,
      street: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
    });

    const validationErrors = validateCustomerForm(formData);
    const errorMap: CustomerFormErrors = {};
    validationErrors.forEach((error) => {
      errorMap[error.field as keyof CustomerFormErrors] = error.message;
    });
    setErrors(errorMap);

    if (validationErrors.length > 0) {
      Alert.alert("Validation Error", "Please check the form for errors.");
      return;
    }

    try {
      await submitOrder();
      if (onOrderSubmitted) {
        onOrderSubmitted();
      }
    } catch (err) {
      Alert.alert("Error", "Failed to submit order. Please try again.");
    }
  };

  const shouldShowError = (field: keyof CustomerFormErrors): boolean => {
    return touched[field] && !!errors[field];
  };

  return (
    <View style={styles.container} testID={testID}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4caf50" />
            <Text style={styles.loadingText}>Submitting your order...</Text>
          </View>
        </View>
      )}
      <ScrollView
        style={[styles.scrollView, loading && styles.disabledView]}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Customer Information</Text>

        {/* Name Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Full Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, shouldShowError("name") && styles.inputError]}
            value={formData.name}
            onChangeText={(value) => handleFieldChange("name", value)}
            onBlur={() => handleFieldBlur("name")}
            placeholder="Enter your full name"
            autoCapitalize="words"
            testID="name-input"
          />
          {shouldShowError("name") && (
            <Text style={styles.errorText}>{errors.name}</Text>
          )}
        </View>

        {/* Email Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Email <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              shouldShowError("email") && styles.inputError,
            ]}
            value={formData.email}
            onChangeText={(value) => handleFieldChange("email", value)}
            onBlur={() => handleFieldBlur("email")}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            testID="email-input"
          />
          {shouldShowError("email") && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        {/* Phone Field */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Phone <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              shouldShowError("phone") && styles.inputError,
            ]}
            value={formData.phone}
            onChangeText={(value) => {
              const digitsOnly = value.replace(/\D/g, "");
              if (digitsOnly.length <= 10) {
                handleFieldChange("phone", value);
              }
            }}
            onBlur={() => handleFieldBlur("phone")}
            placeholder="(123) 456-7890"
            keyboardType="phone-pad"
            testID="phone-input"
          />
          {shouldShowError("phone") && (
            <Text style={styles.errorText}>{errors.phone}</Text>
          )}
        </View>

        {/* Address Fields */}
        <Text style={styles.sectionTitle}>Shipping Address</Text>

        {/* Street Address */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            Street Address <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              shouldShowError("street") && styles.inputError,
            ]}
            value={formData.street}
            onChangeText={(value) => handleFieldChange("street", value)}
            onBlur={() => handleFieldBlur("street")}
            placeholder="123 Main St"
            testID="street-input"
          />
          {shouldShowError("street") && (
            <Text style={styles.errorText}>{errors.street}</Text>
          )}
        </View>

        {/* City */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            City <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, shouldShowError("city") && styles.inputError]}
            value={formData.city}
            onChangeText={(value) => handleFieldChange("city", value)}
            onBlur={() => handleFieldBlur("city")}
            placeholder="City"
            testID="city-input"
          />
          {shouldShowError("city") && (
            <Text style={styles.errorText}>{errors.city}</Text>
          )}
        </View>

        {/* State/Province */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            State/Province <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              shouldShowError("state") && styles.inputError,
            ]}
            value={formData.state}
            onChangeText={(value) => handleFieldChange("state", value)}
            onBlur={() => handleFieldBlur("state")}
            placeholder="State/Province"
            testID="state-input"
          />
          {shouldShowError("state") && (
            <Text style={styles.errorText}>{errors.state}</Text>
          )}
        </View>

        {/* ZIP/Postal Code */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>
            ZIP/Postal Code <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              shouldShowError("zipCode") && styles.inputError,
            ]}
            value={formData.zipCode}
            onChangeText={(value) => handleFieldChange("zipCode", value)}
            onBlur={() => handleFieldBlur("zipCode")}
            placeholder="ZIP/Postal Code"
            keyboardType="number-pad"
            testID="zipcode-input"
          />
          {shouldShowError("zipCode") && (
            <Text style={styles.errorText}>{errors.zipCode}</Text>
          )}
        </View>

        {/* Country */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={formData.country}
            onChangeText={(value) => handleFieldChange("country", value)}
            onBlur={() => handleFieldBlur("country")}
            placeholder="Country (optional)"
            testID="country-input"
          />
        </View>

        {/* Required Fields Note */}
        <Text style={styles.note}>
          * Name is required. Please provide either email or phone number.
          {"\n"}If you provide any address field, all address fields except
          country are required.
        </Text>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          testID="submit-button"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Place Order - {formatCurrency(currentOrder.total)}
            </Text>
          )}
        </TouchableOpacity>

        {error && (
          <Text style={styles.errorMessage} testID="error-message">
            {error}
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default Checkout;

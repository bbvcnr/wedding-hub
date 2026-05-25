import { useLocalSearchParams } from 'expo-router';
import { VendorDetailsScreen } from '@/src/screens/VendorDetailsScreen';

export default function VendorDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  return <VendorDetailsScreen vendorId={id} />;
}

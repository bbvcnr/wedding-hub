import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView, ThemedText } from '@/src/components/theme/themed-view';
import { ThemedButton } from '@/src/components/theme/themed-button';
import { ContactModal } from '@/src/components/molecules/ContactModal';
import { VendorDetails } from '@/src/types/vendor';
import { ApiService } from '@/src/services/api';
import { useTheme } from '@/src/components/theme/theme-provider';
import { useAuth } from '@/src/context/AuthContext';
import { useRouter } from 'expo-router';
import { getFavoriteByVendor, addFavorite, removeFavorite, getShortlistByVendor, addToShortlist, removeFromShortlist } from '@/src/services/weddingService';

const { width } = Dimensions.get('window');

interface VendorDetailsScreenProps {
  vendorId: string;
}

export function VendorDetailsScreen({ vendorId }: VendorDetailsScreenProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { weddingId } = useAuth();
  const [vendor, setVendor] = useState<VendorDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [likeId, setLikeId] = useState<string | null>(null);
  const [shortlistId, setShortlistId] = useState<string | null>(null);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    loadVendorDetails();
  }, [vendorId]);

  const loadVendorDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getVendorDetails(vendorId);
      setVendor(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vendor details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!weddingId) return;
    getFavoriteByVendor(weddingId, vendorId).then((like) => setLikeId(like?.id ?? null));
    getShortlistByVendor(weddingId, vendorId).then((s) => setShortlistId(s?.id ?? null));
  }, [weddingId, vendorId]);

  const handleToggleShortlist = async () => {
    if (!weddingId) return;
    if (shortlistId) {
      await removeFromShortlist(weddingId, shortlistId);
      setShortlistId(null);
    } else {
      const id = await addToShortlist(weddingId, vendorId);
      setShortlistId(id);
    }
  };

  const handleBookVenue = async () => {
    if (!weddingId || !vendor) return;
    const isBooked = vendor.id === vendorId;
    Alert.alert(
      'Book Venue',
      `Mark "${vendor.name}" as your booked venue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Mark as Booked', onPress: async () => {
            const { updateWedding } = await import('@/src/services/weddingService');
            await updateWedding(weddingId, { bookedVenueId: vendor.id, bookedVenueName: vendor.name });
            Alert.alert('', `${vendor.name} marked as your booked venue! 🎉`);
          },
        },
      ]
    );
  };

  const handleToggleFavorite = async () => {
    if (!weddingId) return;
    if (likeId) {
      await removeFavorite(weddingId, likeId);
      setLikeId(null);
    } else {
      const id = await addFavorite(weddingId, vendorId);
      setLikeId(id);
    }
  };

  const handleCall = () => {
    if (vendor?.phone) {
      Linking.openURL(`tel:${vendor.phone}`);
    }
  };

  const handleEmail = () => {
    if (vendor?.email) {
      Linking.openURL(`mailto:${vendor.email}`);
    }
  };

  const handleWebsite = () => {
    if (vendor?.website) {
      const url = vendor.website.startsWith('http') 
        ? vendor.website 
        : `https://${vendor.website}`;
      Linking.openURL(url);
    }
  };

  const handleSocialMedia = (platform: 'facebook' | 'instagram' | 'twitter') => {
    const url = vendor?.socialMedia?.[platform];
    if (url) {
      const fullUrl = url.startsWith('http') ? url : `https://${url}`;
      Linking.openURL(fullUrl);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={16} color="#FCD34D" />
      );
    }
    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FCD34D" />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#FCD34D"
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <ThemedView className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#EC4899" />
          <ThemedText variant="secondary" className="mt-4">
            Loading vendor details...
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    );
  }

  if (error || !vendor) {
    return (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <ThemedView className="flex-1 px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="py-4"
          >
            <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
          </TouchableOpacity>
          <ThemedView className="flex-1 items-center justify-center">
            <ThemedText className="text-lg font-semibold mb-2">
              Error loading vendor
            </ThemedText>
            <ThemedText variant="secondary" className="text-center mb-4">
              {error || 'Vendor not found'}
            </ThemedText>
            <ThemedButton onPress={loadVendorDetails}>Try Again</ThemedButton>
          </ThemedView>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView className="flex-1">
        {/* Image Gallery */}
        <View className="relative">
          <Image
            source={{ uri: vendor.images[selectedImage] || vendor.imageUrl }}
            style={{ width, height: 300 }}
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute top-4 left-4 p-2 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            className="absolute top-4 right-4 p-2 rounded-full"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          >
            <Ionicons name={likeId ? 'heart' : 'heart-outline'} size={24} color={likeId ? '#EC4899' : 'white'} />
          </TouchableOpacity>
        </View>

        {/* Image Thumbnails */}
        {vendor.images && vendor.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ backgroundColor: colors.background, paddingLeft: 12, paddingVertical: 8 }}
          >
            {vendor.images.map((img, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(index)}
                className="mr-2"
              >
                <Image
                  source={{ uri: img }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 8,
                    borderWidth: selectedImage === index ? 2 : 0,
                    borderColor: '#EC4899',
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <ThemedView className="px-4 py-4">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1">
              <ThemedText className="text-2xl font-bold mb-1">
                {vendor.name}
              </ThemedText>
              <ThemedText variant="secondary" className="text-sm mb-2">
                {vendor.category.charAt(0).toUpperCase() + vendor.category.slice(1)}
              </ThemedText>
            </View>
            {vendor.priceRange && (
              <ThemedView 
                className="px-3 py-1 rounded-full"
                variant='card'
              >
                <ThemedText className="font-semibold">
                  {vendor.priceRange}
                </ThemedText>
              </ThemedView>
            )}
          </View>

          {/* Rating */}
          {vendor.rating && (
            <View className="flex-row items-center mb-4">
              <View className="flex-row mr-2">
                {renderStars(vendor.rating)}
              </View>
              <ThemedText variant="secondary" className="text-sm">
                {vendor.rating.toFixed(1)} ({vendor.reviews?.length || 0} reviews)
              </ThemedText>
            </View>
          )}

          {/* Tags */}
          {vendor.tags && vendor.tags.length > 0 && (
            <View className="flex-row flex-wrap mb-4">
              {vendor.tags.map((tag, index) => (
                <ThemedView
                  variant='card'
                  key={index}
                  className="px-3 py-1 rounded-full mr-2 mb-2"
                >
                  <ThemedText variant="secondary" className="text-xs">
                    {tag}
                  </ThemedText>
                </ThemedView>
              ))}
            </View>
          )}

          {/* Description */}
          <ThemedView className="mb-6">
            <ThemedText className="text-lg font-semibold mb-2">
              About
            </ThemedText>
            <ThemedText variant="secondary" className="leading-6">
              {vendor.fullDescription}
            </ThemedText>
          </ThemedView>

          {/* Location */}
          <ThemedView className="mb-6">
            <ThemedText className="text-lg font-semibold mb-3">
              Location
            </ThemedText>
            <View className="flex-row items-center">
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.text.secondary}
              />
              <ThemedText variant="secondary" className="ml-2">
                {vendor.address}
              </ThemedText>
            </View>
          </ThemedView>

          {/* Features */}
          {vendor.features && vendor.features.length > 0 && (
            <ThemedView className="mb-6">
              <ThemedText className="text-lg font-semibold mb-3">
                Features
              </ThemedText>
              {vendor.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#10B981"
                  />
                  <ThemedText variant="secondary" className="ml-2">
                    {feature}
                  </ThemedText>
                </View>
              ))}
            </ThemedView>
          )}

          {/* Opening Hours */}
          {vendor.openingHours && (
            <ThemedView className="mb-6" >
              <ThemedText className="text-lg font-semibold mb-3">
                Opening Hours
              </ThemedText>
              {Object.entries(vendor.openingHours).map(([day, hours]) => (
                <View key={day} className="flex-row justify-between mb-2">
                  <ThemedText variant="secondary">{day}</ThemedText>
                  <ThemedText variant="secondary">{hours}</ThemedText>
                </View>
              ))}
            </ThemedView>
          )}

          {/* Reviews */}
          {vendor.reviews && vendor.reviews.length > 0 && (
            <ThemedView className="mb-6">
              <ThemedText className="text-lg font-semibold mb-3">
                Reviews
              </ThemedText>
              {vendor.reviews.map((review) => (
                <ThemedView
                  key={review.id}
                  className="p-4 rounded-lg mb-3"
                  variant='card'
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <ThemedText className="font-semibold">
                      {review.author}
                    </ThemedText>
                    <View className="flex-row">
                      {renderStars(review.rating)}
                    </View>
                  </View>
                  <ThemedText variant="secondary" className="mb-2">
                    {review.comment}
                  </ThemedText>
                  <ThemedText variant="secondary" className="text-xs">
                    {new Date(review.date).toLocaleDateString()}
                  </ThemedText>
                </ThemedView>
              ))}
            </ThemedView>
          )}
          {/* Contact Actions */}
          <ThemedView className="mb-8">
            {/* Social Media */}
            {vendor.socialMedia && (
              <View className="flex-row justify-center gap-4 mb-4">
                {vendor.socialMedia.facebook && (
                  <TouchableOpacity
                    onPress={() => handleSocialMedia('facebook')}
                    className="p-3 rounded-full"
                    style={{ backgroundColor: colors.card }}
                  >
                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                  </TouchableOpacity>
                )}
                {vendor.socialMedia.instagram && (
                  <TouchableOpacity
                    onPress={() => handleSocialMedia('instagram')}
                    className="p-3 rounded-full"
                    style={{ backgroundColor: colors.card }}
                  >
                    <Ionicons name="logo-instagram" size={24} color="#E4405F" />
                  </TouchableOpacity>
                )}
                {vendor.socialMedia.twitter && (
                  <TouchableOpacity
                    onPress={() => handleSocialMedia('twitter')}
                    className="p-3 rounded-full"
                    style={{ backgroundColor: colors.card }}
                  >
                    <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
                  </TouchableOpacity>
                )}
              </View>
            )}
            <View className="flex-row gap-2 mb-3">
              {vendor.phone && (
                <ThemedButton
                  title="Call"
                  onPress={handleCall}
                  variant="primary"
                  color="green"
                  leftIcon={<Ionicons name="call" size={18} color="white" />}
                  className="flex-1"
                />
              )}
              {vendor.email && (
                <ThemedButton
                  title="Email"
                  onPress={handleEmail}
                  variant="primary"
                  color="pink"
                  leftIcon={<Ionicons name="mail" size={18} color="white" />}
                  className="flex-1"
                />
              )}
            </View>

            {vendor.website && (
              <ThemedButton
                title="Visit Website"
                onPress={handleWebsite}
                variant="outline"
                color="pink"
                leftIcon={<Ionicons name="globe-outline" size={18} color={colors.accent.pink} />}
                className="mb-3"
              />
            )}

            {vendor.category === 'venue' && (
              <ThemedButton
                title="Mark as Booked Venue"
                onPress={handleBookVenue}
                variant="primary"
                color="green"
                size="lg"
                className="mb-3"
                leftIcon={<Ionicons name="checkmark-circle-outline" size={18} color="white" />}
              />
            )}
            <ThemedButton
              title={shortlistId ? 'Remove from Shortlist' : 'Add to Shortlist'}
              onPress={handleToggleShortlist}
              variant="outline"
              color="green"
              size="lg"
              className="mb-3"
              leftIcon={<Ionicons name={shortlistId ? 'bookmark' : 'bookmark-outline'} size={18} color="#14B8A6" />}
            />
            <ThemedButton
              title="Kontaktiraj / Send Inquiry"
              onPress={() => setShowContact(true)}
              variant="primary"
              color="pink"
              size="lg"
              leftIcon={<Ionicons name="chatbubble-ellipses-outline" size={18} color="white" />}
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>

      <ContactModal
        visible={showContact}
        vendorId={vendorId}
        vendorName={vendor.name}
        onClose={() => setShowContact(false)}
      />
    </SafeAreaView>
  );
}

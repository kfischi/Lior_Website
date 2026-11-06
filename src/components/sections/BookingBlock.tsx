import { getBrand } from '@/lib/sanity/content';
import { BookingForm } from './BookingForm';

/** Server wrapper: computes the selectable days and feeds the client form. */
export async function BookingBlock() {
  const brand = await getBrand();
  return (
    <BookingForm
      windows={brand.booking.windows}
      meetings={brand.booking.meetings}
      matters={brand.practiceAreas.map((a) => a.title)}
    />
  );
}

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  initials: string;
};

/**
 * Only genuine client testimonials belong here. Employment references from
 * the personal portfolio are deliberately excluded: they speak to Darshan as
 * an employee, not to D2D Web as a supplier.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "The Shan Booth site is exactly what I needed — beautiful design, simple checkout, and bookings started coming in within the first week of going live.",
    author: "The Shan Booth",
    role: "Business Owner",
    initials: "SB",
  },
];

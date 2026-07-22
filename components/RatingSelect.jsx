import { Star } from "lucide-react";

export default function RatingSelect({
  value = 0,
  onChange,
  editable = false,
}) {
  return (
    <div className="flex gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={28}
          onClick={() => {
            if (editable && onChange) {
              onChange(star);
            }
          }}
          className={`cursor-pointer transition ${
            star <= Number(value)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}
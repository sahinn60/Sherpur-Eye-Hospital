import { useLang } from "@/context/LangContext";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useLang();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="text-6xl mb-4">⚠️</div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">
        {t("কিছু একটা সমস্যা হয়েছে", "Something went wrong")}
      </h3>
      <p className="text-gray-400 text-sm max-w-sm mb-6">
        {message || t("তথ্য লোড করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", "Failed to load data. Please try again.")}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          {t("আবার চেষ্টা করুন", "Try Again")}
        </button>
      )}
    </div>
  );
}

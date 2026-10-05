import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { getFirebaseErrorMessage } from "../../lib/utils";

export default function DataBoundary({ loading, error, onRetry, children }) {
  if (loading) return <LoadingState />;
  if (error) {
    return (
      <ErrorState message={getFirebaseErrorMessage(error)} onRetry={onRetry} />
    );
  }
  return children;
}
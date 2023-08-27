import { useCallback, useEffect, useState } from "react";
import { isImageUrl } from "./validators";

interface Ifield {
  predicate: string;
}

const validateField = (value: string, predicate: string) => {
  let error = null
  if (predicate.toLowerCase().includes("image")) {
    if (value !== "" && !isImageUrl(value)) {
      error = "Please enter a valid image URL";
    }
  }
  return error;
};

const PredicateValue = ({ predicate }: Ifield) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleObjectChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setError(validateField(value, predicate));
      setValue(value);
    },
    [predicate],
  );

  useEffect(() => {
    const {value} = document.querySelector("#object") as HTMLInputElement;
    setError(validateField(value, predicate)); // reset errors when changing field
  }, [predicate]);

  const isTimePredicate = predicate.endsWith("On"); // time predicates suffix convention

  return (
    <div className="form-field">
      <label htmlFor="object">value</label>
      {isTimePredicate ? (
        <input id="object" type="datetime-local" value={value} onChange={handleObjectChange} className="form-control" />
      ) : (
        <input id="object" type="text" value={value} onChange={handleObjectChange} className="form-control" />
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default PredicateValue;

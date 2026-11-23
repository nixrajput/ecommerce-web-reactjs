import { useEffect } from "react";

function MetaData({ title }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
}

export default MetaData;

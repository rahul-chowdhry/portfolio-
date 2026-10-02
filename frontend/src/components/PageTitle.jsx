import { useEffect } from "react";

function PageTitle({ title, description }) {
  useEffect(() => {
    document.title = title
      ? `${title} | TECH WORLD`
      : "TECH WORLD | Rahul Kumar";

    if (description) {
      let metaDescription = document.querySelector(
        'meta[name="description"]'
      );

      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.setAttribute("name", "description");
        document.head.appendChild(metaDescription);
      }

      metaDescription.setAttribute("content", description);
    }
  }, [title, description]);

  return null;
}

export default PageTitle;
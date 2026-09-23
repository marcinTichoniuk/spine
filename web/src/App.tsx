import { useEffect, useState } from "react";

type Link = {
  id: string;
  url: string;
  created_at: string;
  title: string | null;
};

function App() {
  const [links, setLinks] = useState<Link[] | null>(null);

  useEffect(() => {
    let ignore = false;

    const fetchLinks = async () => {
      setLinks(null);

      const response = await fetch("/api/links", {
        method: "GET",
      });
      const result = await response.json();

      if (!ignore) {
        setLinks(result.data);
      }
    };

    fetchLinks();

    return () => {
      ignore = true;
    };
  }, []);

  console.log(links);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: formData.get("url"),
        title: formData.get("title") || null,
      }),
    });

    if (!response.ok) return;

    const result = await response.json();

    setLinks((prev) => [result.data, ...(prev ?? [])]);
    form.reset();
  };

  return (
    <>
      <div className="flex flex-col gap-10">
        {links && links.length > 0 && (
          <ul className="flex flex-col gap-2">
            {links.map((link) => (
              <li key={link.id} className="flex flex-col gap-0.5">
                {link.title && <h2>{link.title}</h2>}
                <h3>{link.url}</h3>
                <p>{link.created_at}</p>
              </li>
            ))}
          </ul>
        )}
        <form className="flex flex-col gap-1 w-1/2" onSubmit={handleSubmit}>
          <input
            type="url"
            name="url"
            required
            className="border border-black px-1"
            placeholder="url"
          />
          <input
            type="text"
            name="title"
            className="border border-black px-1"
            placeholder="title"
          />
          <div>
            <button type="submit" className="border p-1 border-black">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default App;

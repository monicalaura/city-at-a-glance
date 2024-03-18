import { useEffect, useRef } from "react";
import { useChat } from "ai/react";

export default function Chat() {
  const ref = useRef(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      initialMessages: [
        {
          id: Date.now().toString(),
          role: "system",
          content: "You are an assistant that gives short answers.",
        },
      ],
      onResponse: () => {
        // Your response handling logic here
      },
    });

  useEffect(() => {
    if (ref.current === null) return;
    ref.current.scrollTo(0, ref.current.scrollHeight);
  }, [messages]);

  function onSubmit(e) {
    e.preventDefault();
    handleSubmit(e);
  }

  return (
    <section className="py-24">
      <div className="container chatArea max-w-3xl">
        {/* Chat area */}
        <div className="mx-auto mt-3 w-full max-w-lg">
          <div
            className="mb-2 chatBox  h-[400px] rounded-md border p-4 overflow-y-auto"
            ref={ref}
          >
            {messages.map((m) => (
              <div key={m.id} className="mr-6 whitespace-pre-wrap md:mr-12">
                {m.role === "user" && (
                  <div className="mb-6 flex gap-3">
                    <div className="mt-1.5">
                      <p className="font-semibold">You</p>
                      <div className="mt-1.5 text-sm text-zinc-500">
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}

                {m.role === "assistant" && (
                  <div className="mb-6 flex gap-3">
                    <div className="mt-1.5 w-full">
                      <div className="flex justify-between">
                        <p className="font-semibold">Bot</p>
                      </div>
                      <div className="mt-2 text-sm text-zinc-500">
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="relative">
            <input
              name="message"
              value={input}
              onChange={handleInputChange}
              placeholder="e.g Museums in (city name)..."
              className="pr-12 placeholder-italic placeholder-text-zinc-600/75 focus-visible:ring-zinc-500 border border-gray-300 rounded-md p-2"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="chatBtn bg-brand-primary text-white p-2 ml-2 rounded-md w-full hover:bg-brand-accent transition-all duration-300"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

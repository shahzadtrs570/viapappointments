import { archivoBlack, defaultFont, sarabun } from "@package/fonts"

export default function FontsDemo() {
  return (
    <div className="mx-auto max-w-4xl p-8">
      {/* Header */}
      <header className="mb-12">
        <h1
          className={`${archivoBlack.className} mb-4 text-4xl dark:text-white`}
        >
          Typography System
        </h1>
        <p
          className={`${sarabun.className} text-lg text-gray-600 dark:text-gray-300`}
        >
          Complete overview of font weights and sizes used in the application
        </p>
      </header>

      <div className="grid gap-12">
        {/* Default Font Section */}
        <section className="space-y-6">
          <h2
            className={`${defaultFont.className} border-b border-gray-200 pb-2 text-2xl dark:border-gray-700 dark:text-white`}
          >
            Default Font
          </h2>
          <div className="grid gap-6 rounded-lg border bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800">
            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Default Font Usage
              </span>
              <p className={`${defaultFont.className} text-lg dark:text-white`}>
                This is the default font for the application. Use this font
                unless you specifically need a different font.
              </p>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Example in different weights
              </span>
              <div className="space-y-2">
                <p
                  className={`${defaultFont.className} font-light dark:text-white`}
                >
                  Light weight text with default font
                </p>
                <p
                  className={`${defaultFont.className} font-normal dark:text-white`}
                >
                  Normal weight text with default font
                </p>
                <p
                  className={`${defaultFont.className} font-medium dark:text-white`}
                >
                  Medium weight text with default font
                </p>
                <p
                  className={`${defaultFont.className} font-bold dark:text-white`}
                >
                  Bold weight text with default font
                </p>
              </div>
            </div>

            <div className="rounded border bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Code Example
              </span>
              <code className="block rounded bg-gray-100 p-2 text-sm dark:bg-gray-800 dark:text-gray-300">
                import {"{"} defaultFont {"}"} from &apos;@package/fonts&apos;
                <br />
                &lt;p className={"{`${defaultFont.className}`}"}&gt;
                <br />
                &nbsp;&nbsp;Your text here
                <br />
                &lt;/p&gt;
              </code>
            </div>
          </div>
        </section>

        {/* Sarabun Font Weights */}
        <section className="space-y-6">
          <h2
            className={`${archivoBlack.className} border-b border-gray-200 pb-2 text-2xl dark:border-gray-700 dark:text-white`}
          >
            Sarabun Font Weights
          </h2>
          <div className="grid gap-4">
            <div className={`${sarabun.className} font-thin dark:text-white`}>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Thin (100)
              </span>
              The quick brown fox jumps over the lazy dog
            </div>

            <div className={`${sarabun.className} font-normal dark:text-white`}>
              <span className="block text-sm text-gray-500 dark:text-gray-400">
                Regular (400)
              </span>
              The quick brown fox jumps over the lazy dog
            </div>
          </div>
        </section>

        {/* Text Sizes */}
        <section className="space-y-6">
          <h2
            className={`${archivoBlack.className} border-b border-gray-200 pb-2 text-2xl dark:border-gray-700 dark:text-white`}
          >
            Text Sizes
          </h2>
          <div className="grid gap-6">
            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Extra Small (xs)
              </span>
              <p className={`${sarabun.className} text-xs dark:text-white`}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Small (sm)
              </span>
              <p className={`${sarabun.className} text-sm dark:text-white`}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Base
              </span>
              <p className={`${sarabun.className} text-base dark:text-white`}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Large (lg)
              </span>
              <p className={`${sarabun.className} text-lg dark:text-white`}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Extra Large (xl)
              </span>
              <p className={`${sarabun.className} text-xl dark:text-white`}>
                The quick brown fox jumps over the lazy dog
              </p>
            </div>
          </div>
        </section>

        {/* Archivo Black */}
        <section className="space-y-6">
          <h2
            className={`${archivoBlack.className} border-b border-gray-200 pb-2 text-2xl dark:border-gray-700 dark:text-white`}
          >
            Archivo Black
          </h2>
          <div className="grid gap-6">
            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Heading 1
              </span>
              <h1
                className={`${archivoBlack.className} text-4xl dark:text-white`}
              >
                The quick brown fox jumps over the lazy dog
              </h1>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Heading 2
              </span>
              <h2
                className={`${archivoBlack.className} text-3xl dark:text-white`}
              >
                The quick brown fox jumps over the lazy dog
              </h2>
            </div>

            <div>
              <span className="mb-2 block text-sm text-gray-500 dark:text-gray-400">
                Heading 3
              </span>
              <h3
                className={`${archivoBlack.className} text-2xl dark:text-white`}
              >
                The quick brown fox jumps over the lazy dog
              </h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

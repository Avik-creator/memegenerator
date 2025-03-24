# Meme Generator

## Overview

This project is a dynamic meme generator built with React and TypeScript.  It allows users to upload a main image, overlay additional images, and add custom text elements to create personalized memes.  The application provides a user-friendly interface with drag-and-drop functionality, resizing options, and text styling controls.  Download the meme as a PNG for easy sharing.

## Features

*   **Main Image Upload:** Upload any image to serve as the base of your meme.
*   **Overlay Image Support:** Add multiple overlay images to enhance the meme.
*   **Drag-and-Drop Interface:** Easily position images and text elements within the meme preview.
*   **Text Element Creation:** Add custom text elements with control over content, color, font size, and outline (stroke width).
*   **Z-Index Management:** Bring selected elements to the front of the meme.
*   **Resizing:** Adjust the size of overlay images.
*   **Customization:** Options to set color, font size and stroke width for text elements
*   **Download:** Download the final meme as a PNG image.
*   **Image Switching:** Quick action to switch main image and overlay image to give more possibilities.
*   **Position Reset:** Resets the position of selected elements to the center.

## Technologies Used

*   **NextJS:** A React Framework which helps with SSR and SEO.
*   **TypeScript:** A typed superset of JavaScript that adds static typing.
*   **React-Dropzone:** A library for building drag and drop file upload interfaces.
*   **html-to-image:** A library to turn arbitrary HTML into an image.
*   **Lucide React:** Beautifully simple, pixel-perfect icons for React.
*   **ShadCN UI:** A set of beautifully-designed, accessible components and a code distribution platform. 
*   **Tailwind CSS:** A utility-first CSS framework for rapidly styling custom designs.
*   **uuid:**  Simple, fast generation of RFC4122 UUIDs.

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Avik-creator/memegenerator.git
    ```

2.  **Navigate to the project directory:**

    ```bash
    cd memegenerator
    ```

3.  **Install dependencies:**

    ```bash
    bun install  # or yarn install or pnpm install
    ```

## Running the Application

1.  **Start the development server:**

    ```bash
    bun run dev # or yarn dev or pnpm dev
    ```

2.  **Open your browser and navigate to the specified development server address (usually `http://localhost:3000`).**

## Usage

1.  **Upload a Main Image:**  Drag and drop an image into the "Main Image" section or click to select one from your file system.
2.  **Add Overlays:**  Drag and drop images into the "Overlays" section or click to select them.
3.  **Add Text:**  Enter text content, customize its color, font size, and outline, and click "Add Text".
4.  **Position Elements:** Click and drag images and text elements within the preview area to reposition them.
5.  **Resize Overlays:** Select an overlay and use the slider to adjust its size.
6.  **Manage Z-Index:** Select an element and click "Bring to Front" to move it above other elements.
7.  **Position Reset:** Select an element and click "Reset Position" to move it to the center.
8.  **Download Meme:** Click "Download Meme" to save the final image as a PNG file.



## Contributing

Contributions are welcome!  If you'd like to contribute to this project, please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your fork.
5.  Submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Future Enhancements

*   **Font Selection:**  Allow users to choose from a variety of fonts for text elements.
*   **Rotation:** Add the ability to rotate images and text elements.
*   **More Advanced Text Styling:**  Add options for text alignment, bold/italics, and more advanced shadows.
*   **Meme Templates:** Integrate pre-designed meme templates for quick creation.
*   **Social Sharing:**  Enable direct sharing of memes to social media platforms.
*   **Undo/Redo Functionality:** Implement undo/redo capabilities.

## Contact

If you have any questions or suggestions, feel free to contact me at avikm744@gmail.com

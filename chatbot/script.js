// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // Get DOM elements
    const attachFileButton = document.getElementById('attachFileButton');
    const sidebarAttachFileButton = document.getElementById('sidebarAttachFileButton');
    const fileInput = document.getElementById('fileInput');
    const selectedFilesContainer = document.getElementById('selectedFilesContainer');
    const micButton = document.getElementById('micButton');
    const speechError = document.getElementById('speechError');
    const textarea = document.querySelector('textarea');

    // Debug log to check if elements are found
    console.log('Elements found:', {
        attachFileButton: attachFileButton,
        sidebarAttachFileButton: sidebarAttachFileButton,
        fileInput: fileInput,
        selectedFilesContainer: selectedFilesContainer,
        micButton: micButton,
        speechError: speechError,
        textarea: textarea
    });

    // Speech Recognition Setup
    let recognition = null;
    let isListening = false;

    // Check if browser supports speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        // Handle speech recognition results
        recognition.onresult = function(event) {
            const transcript = Array.from(event.results)
                .map(result => result[0].transcript)
                .join('');
            
            if (textarea) {
                textarea.value = transcript;
            }
        };

        // Handle errors
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            if (speechError) {
                speechError.textContent = `Error: ${event.error}`;
                speechError.style.display = 'block';
            }
            stopListening();
        };

        // Handle end of speech recognition
        recognition.onend = function() {
            stopListening();
        };
    } else {
        console.error('Speech recognition not supported');
        if (speechError) {
            speechError.textContent = 'Speech recognition is not supported in your browser';
            speechError.style.display = 'block';
        }
        if (micButton) {
            micButton.style.display = 'none';
        }
    }

    // Function to start listening
    function startListening() {
        if (recognition) {
            try {
                recognition.start();
                isListening = true;
                if (micButton) {
                    micButton.classList.add('listening');
                    micButton.innerHTML = '<i class="bx bx-stop"></i>';
                }
                if (speechError) {
                    speechError.style.display = 'none';
                }
            } catch (error) {
                console.error('Error starting speech recognition:', error);
                if (speechError) {
                    speechError.textContent = 'Error starting speech recognition';
                    speechError.style.display = 'block';
                }
            }
        }
    }

    // Function to stop listening
    function stopListening() {
        if (recognition) {
            recognition.stop();
            isListening = false;
            if (micButton) {
                micButton.classList.remove('listening');
                micButton.innerHTML = '<i class="bx bx-microphone"></i>';
            }
        }
    }

    // Toggle speech recognition on mic button click
    if (micButton) {
        micButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (isListening) {
                stopListening();
            } else {
                startListening();
            }
        });
    }

    // Function to create a file item element
    function createFileItem(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        // Create file name span
        const fileName = document.createElement('span');
        fileName.textContent = file.name;
        
        // Create remove button
        const removeButton = document.createElement('button');
        removeButton.innerHTML = '<i class="bx bx-x"></i>';
        removeButton.className = 'remove-file';
        removeButton.onclick = () => {
            fileItem.remove();
        };
        
        fileItem.appendChild(fileName);
        fileItem.appendChild(removeButton);
        return fileItem;
    }

    // Handle file selection
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            console.log('File input changed');
            const files = event.target.files;
            console.log('Selected files:', files);
            
            if (files.length > 0 && selectedFilesContainer) {
                for (let file of files) {
                    console.log('Processing file:', file.name);
                    const fileItem = createFileItem(file);
                    selectedFilesContainer.appendChild(fileItem);
                }
            }
            
            // Reset the file input so the same file can be selected again
            fileInput.value = '';
        });
    }

    // Connect the attach file buttons to trigger file input
    if (attachFileButton && fileInput) {
        attachFileButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Main attach button clicked');
            fileInput.click();
        });
    }

    if (sidebarAttachFileButton && fileInput) {
        sidebarAttachFileButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Sidebar attach button clicked');
            fileInput.click();
        });
    }
});

// Add error handling
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
});

# Quickstart: HIIT Workout Timer

## Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (for development) OR just open the HTML file directly

## Running the App

### Option 1: Direct File Open
Simply open `src/index.html` in your browser.

### Option 2: Local Server (recommended for development)
```bash
# Using Python
cd src && python3 -m http.server 8000

# Using Node.js
npx serve src

# Using PHP
cd src && php -S localhost:8000
```
Then open http://localhost:8000

## Project Structure

```
src/
├── index.html    # Main page structure
├── styles.css    # All styling
├── app.js        # Timer logic
└── audio.js      # Sound generation
```

## Development Notes

- No build step required - edit files and refresh browser
- Test on mobile by accessing your local IP (e.g., http://192.168.1.x:8000)
- Audio requires user interaction first (browser policy) - handled by start button

## Testing Checklist

- [ ] Timer counts down accurately
- [ ] Audio plays on phase transitions
- [ ] Colors change between work/rest
- [ ] Pause/resume works correctly
- [ ] Reset returns to initial state
- [ ] Config persists after page reload
- [ ] Works on mobile (touch, readable display)
- [ ] Works offline after first load

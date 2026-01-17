from PIL import Image
import imagehash
import os

def compute_phash(file_path: str) -> str | None:
    """
    Compute perceptual hash using imagehash.
    Returns None if file is not an image or error occurs.
    """
    ext = os.path.splitext(file_path)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
        return None
        
    try:
        with Image.open(file_path) as img:
            phash = imagehash.phash(img)
            return str(phash)
            
    except Exception:
        # If imagehash not installed or image load fails, try simple fallback
        # But we are instructed to use Pillow if imagehash fails
        try:
            return _simple_phash_fallback(file_path)
        except Exception:
            return None

def _simple_phash_fallback(file_path: str) -> str | None:
    """Simple 8x8 average hash implementation using Pillow."""
    try:
        with Image.open(file_path) as img:
            # Resize to 8x8, convert to grayscale
            img = img.resize((8, 8), Image.Resampling.LANCZOS).convert('L')
            pixels = list(img.getdata())
            avg = sum(pixels) / len(pixels)
            
            # Create bits
            bits = "".join(['1' if p > avg else '0' for p in pixels])
            
            # Convert binary string to hex
            hex_val = hex(int(bits, 2))[2:]
            return hex_val
    except Exception:
        return None

def compare_phash(hash1: str, hash2: str) -> int:
    """
    Compare two hashes and return distance (Hamming distance).
    Lower distance = more similar.
    Returns distance integer.
    """
    if not hash1 or not hash2:
        return 100 # High distance if None
        
    # Use imagehash logic if strings are hex
    try:
        if hasattr(imagehash, 'hex_to_hash'):
             h1 = imagehash.hex_to_hash(hash1)
             h2 = imagehash.hex_to_hash(hash2)
             return h1 - h2
    except (ValueError, AttributeError, ImportError):
        pass
        
    # Manual hamming distance for hex strings
    try:
        # Convert hex to int
        n1 = int(hash1, 16)
        n2 = int(hash2, 16)
        # XOR and count bits
        x = n1 ^ n2
        return bin(x).count('1')
    except Exception:
        return 100

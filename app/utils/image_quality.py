from PIL import Image, ImageFilter, ImageStat, UnidentifiedImageError
import io
import os

def compute_quality_score(file_path: str) -> int:
    """
    Compute quality score (0-100) for an image.
    Uses sharpness and resolution.
    Returns 50 for non-image files.
    """
    ext = os.path.splitext(file_path)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp']:
        return 50

    try:
        with Image.open(file_path) as img:
            # 1. Resolution Score (0-50)
            width, height = img.size
            min_dim = min(width, height)
            
            # Simple linear scale: 500px -> 0, 2000px -> 50
            res_score = min(50, max(0, int((min_dim - 500) / 30)))
            
            # 2. Sharpness Score (0-50)
            # Convert to grayscale
            gray = img.convert('L')
            # Find edges
            edges = gray.filter(ImageFilter.FIND_EDGES)
            # Calculate variance of edges (more variance = sharper)
            stat = ImageStat.Stat(edges)
            variance = stat.var[0]
            
            # Heuristic map: var 0 -> 0, var 500 -> 50
            sharp_score = min(50, int(variance / 10))
            
            total_score = res_score + sharp_score
            return min(100, max(0, total_score))
            
    except (UnidentifiedImageError, OSError, Exception):
        # Fallback if image cannot be opened
        return 50

import logging
import sys
from pathlib import Path

from app.config import settings


def setup_logger(name: str = __name__) -> logging.Logger:
    """
    Setup structured logger with timestamp, level, and module information.
    
    Args:
        name: Logger name, typically __name__ of the calling module
        
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    
    # Set log level from settings
    log_level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logger.setLevel(log_level)
    
    # Avoid duplicate handlers
    if logger.handlers:
        return logger
    
    # Create console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    
    # Create formatter with timestamp, level, module, and message
    formatter = logging.Formatter(
        fmt='%(asctime)s - %(levelname)s - %(name)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(formatter)
    
    # Add handler to logger
    logger.addHandler(console_handler)
    
    return logger


# Default application logger
logger = setup_logger("smartclaim")

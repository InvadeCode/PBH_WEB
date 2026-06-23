from PIL import Image
import numpy as np

img = Image.open('public/clients/logos/hero_lectro/hero_lectro_new.png').convert('RGBA')
data = np.array(img)

# Find white pixels (r > 200, g > 200, b > 200) and make them transparent
white_areas = (data[:,:,0] > 240) & (data[:,:,1] > 240) & (data[:,:,2] > 240)
data[..., 3][white_areas] = 0

Image.fromarray(data).save('public/clients/logos/hero_lectro/hero_lectro_transparent.png')
print("Image converted")

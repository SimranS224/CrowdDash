import numpy as np

from sklearn.cluster import KMeans


def dominant_color(img):
    def make_histogram(cluster):
        """
        Count the number of pixels in each cluster
        :param: KMeans cluster
        :return: numpy histogram
        """
        numLabels = np.arange(0, len(np.unique(cluster.labels_)) + 1)
        hist, _ = np.histogram(cluster.labels_, bins=numLabels)
        hist = hist.astype('float32')
        hist /= hist.sum()
        return hist

    # reshape the image to be a simple list of RGB pixels
    image = img.reshape(-1, 3)

    # we'll pick the 5 most common colors
    num_clusters = 5
    clusters = KMeans(n_clusters=num_clusters)
    clusters.fit(image)

    # count the dominant colors and put them in "buckets"
    histogram = make_histogram(clusters)
    # then sort them, most-common first
    combined = zip(histogram, clusters.cluster_centers_)
    combined = sorted(combined, key=lambda x: x[0], reverse=True)

    r, g, b = int(combined[0][1][0]), int(combined[0][1][1]), int(combined[0][1][2])

    return r, g, b


def rgb_to_hex(r, g, b): 
  r = max(0, min(r, 255))
  g = max(0, min(g, 255))
  b = max(0, min(b, 255))
  return "#{0:02x}{1:02x}{2:02x}".format(r, g, b)
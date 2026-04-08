from tensorflow import keras


def build_lstm(input_steps: int, input_features: int, n_classes: int = 4) -> keras.Model:
    model = keras.Sequential(
        [
            keras.layers.Input(shape=(input_steps, input_features)),
            keras.layers.LSTM(64, return_sequences=True),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(32),
            keras.layers.Dense(32, activation="relu"),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(n_classes, activation="softmax"),
        ]
    )
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def build_gru(input_steps: int, input_features: int, n_classes: int = 4) -> keras.Model:
    model = keras.Sequential(
        [
            keras.layers.Input(shape=(input_steps, input_features)),
            keras.layers.GRU(64, return_sequences=True),
            keras.layers.Dropout(0.2),
            keras.layers.GRU(32),
            keras.layers.Dense(32, activation="relu"),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(n_classes, activation="softmax"),
        ]
    )
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


def build_cnn(image_size: int = 64, n_classes: int = 2) -> keras.Model:
    model = keras.Sequential(
        [
            keras.layers.Input(shape=(image_size, image_size, 1)),
            keras.layers.Conv2D(32, kernel_size=3, activation="relu", padding="same"),
            keras.layers.MaxPooling2D(),
            keras.layers.Conv2D(64, kernel_size=3, activation="relu", padding="same"),
            keras.layers.MaxPooling2D(),
            keras.layers.Conv2D(128, kernel_size=3, activation="relu", padding="same"),
            keras.layers.MaxPooling2D(),
            keras.layers.Flatten(),
            keras.layers.Dense(128, activation="relu"),
            keras.layers.Dropout(0.3),
            keras.layers.Dense(n_classes, activation="softmax"),
        ]
    )
    model.compile(
        optimizer=keras.optimizers.Adam(1e-3),
        loss="categorical_crossentropy",
        metrics=["accuracy"],
    )
    return model


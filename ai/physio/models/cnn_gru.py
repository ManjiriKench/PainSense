import torch
import torch.nn as nn


class CNN_GRU_PainModel(nn.Module):
    """
    Lightweight physiological pain estimation model.

    Input:
        x -> (batch_size, time_steps, channels)
             e.g. (B, 1250, 5)

    Output:
        pain_score -> (batch_size,)
    """

    def __init__(self, num_channels=5, gru_hidden_size=64):
        super().__init__()

        # --------------------------------------------------
        # 1D CNN: Extract short-term temporal patterns
        # --------------------------------------------------
        self.cnn = nn.Sequential(
            # Layer 1
            nn.Conv1d(
                in_channels=num_channels,
                out_channels=32,
                kernel_size=7,
                padding=3
            ),
            nn.BatchNorm1d(32),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Dropout(0.2),

            # Layer 2
            nn.Conv1d(
                in_channels=32,
                out_channels=64,
                kernel_size=5,
                padding=2
            ),
            nn.BatchNorm1d(64),
            nn.ReLU(),
            nn.MaxPool1d(2),
            nn.Dropout(0.3),

            # Layer 3 (New for deeper features)
            nn.Conv1d(
                in_channels=64,
                out_channels=128,
                kernel_size=3,
                padding=1
            ),
            nn.BatchNorm1d(128),
            nn.ReLU(),
            nn.Dropout(0.3)
        )

        # --------------------------------------------------
        # GRU: Model temporal dependencies (memory)
        # --------------------------------------------------
        # Input size is 128 (from last CNN layer)
        self.gru = nn.GRU(
            input_size=128,
            hidden_size=gru_hidden_size,
            num_layers=2,        # Stacked GRU for better context
            batch_first=True,
            dropout=0.3          # Dropout between GRU layers
        )

        # --------------------------------------------------
        # Regression head: Map GRU state to pain score
        # --------------------------------------------------
        self.regressor = nn.Sequential(
            nn.Linear(gru_hidden_size, 64),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1)
        )

    def forward(self, x):
        """
        Forward pass

        Parameters
        ----------
        x : torch.Tensor
            Shape (batch_size, time_steps, channels)

        Returns
        -------
        pain_score : torch.Tensor
            Shape (batch_size,)
        """

        # (B, T, C) -> (B, C, T) for Conv1d
        x = x.permute(0, 2, 1)

        # CNN feature extraction
        x = self.cnn(x)

        # (B, C, T) -> (B, T, C) for GRU
        x = x.permute(0, 2, 1)

        # GRU forward pass
        _, h_n = self.gru(x)

        # h_n shape: (num_layers, B, hidden_size)
        # Take the last layer's hidden state: (B, hidden_size)
        h_n = h_n[-1]

        # Final regression
        pain_score = self.regressor(h_n)

        # (B, 1) -> (B,)
        return pain_score.squeeze(1)

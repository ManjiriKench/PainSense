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
            nn.Conv1d(
                in_channels=num_channels,
                out_channels=32,
                kernel_size=5,
                padding=2
            ),
            nn.ReLU(),
            nn.BatchNorm1d(32),

            nn.Conv1d(
                in_channels=32,
                out_channels=64,
                kernel_size=5,
                padding=2
            ),
            nn.ReLU(),
            nn.BatchNorm1d(64)
        )

        # --------------------------------------------------
        # GRU: Model temporal dependencies (memory)
        # --------------------------------------------------
        self.gru = nn.GRU(
            input_size=64,
            hidden_size=gru_hidden_size,
            batch_first=True
        )

        # --------------------------------------------------
        # Regression head: Map GRU state to pain score
        # --------------------------------------------------
        self.regressor = nn.Sequential(
            nn.Linear(gru_hidden_size, 32),
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

        # h_n shape: (1, B, hidden_size) -> (B, hidden_size)
        h_n = h_n.squeeze(0)

        # Final regression
        pain_score = self.regressor(h_n)

        # (B, 1) -> (B,)
        return pain_score.squeeze(1)

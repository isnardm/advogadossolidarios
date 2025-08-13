package advogados_popular.api_advogados_popular.DTOs.Chat;

import java.time.LocalDateTime;

public record MensagemResponseDTO(Long id, String conteudo, LocalDateTime enviadaEm, String remetente) {
}


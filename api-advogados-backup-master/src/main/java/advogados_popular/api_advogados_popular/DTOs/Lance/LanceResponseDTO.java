package advogados_popular.api_advogados_popular.DTOs.Lance;

import java.math.BigDecimal;

public record LanceResponseDTO(Long id, BigDecimal valor, Long causaId, Long advogadoId, Long chatId) {
}


package advogados_popular.api_advogados_popular.DTOs.Lance;

import java.math.BigDecimal;
import advogados_popular.api_advogados_popular.DTOs.statusProposta;

public record LanceResponseDTO(Long id, BigDecimal valor, Long causaId, Long advogadoId, Long chatId, statusProposta status) {
}


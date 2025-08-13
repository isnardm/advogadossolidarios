package advogados_popular.api_advogados_popular.DTOs.Lance;

import java.math.BigDecimal;

public record LancePendenteResponseDTO(Long id, BigDecimal valor,
                                       Long causaId, String causaTitulo,
                                       Long advogadoId, String advogadoNome) {
}

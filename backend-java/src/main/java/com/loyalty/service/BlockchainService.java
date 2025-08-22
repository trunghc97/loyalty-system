package com.loyalty.service;

import com.loyalty.model.Transaction;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class BlockchainService {
    private final RestTemplate restTemplate;

    @Value("${blockchain.api.url}")
    private String blockchainApiUrl;

    public String anchorReceipt(Transaction transaction) {
        String url = blockchainApiUrl + "/blockchain/anchor-receipt";
        var response = restTemplate.postForObject(url, transaction, BlockchainResponse.class);
        return response != null ? response.getTxHash() : null;
    }

    public String trade(Transaction transaction) {
        String url = blockchainApiUrl + "/blockchain/trade";
        var response = restTemplate.postForObject(url, transaction, BlockchainResponse.class);
        return response != null ? response.getTxHash() : null;
    }

    public String pay(Transaction transaction) {
        String url = blockchainApiUrl + "/blockchain/pay";
        var response = restTemplate.postForObject(url, transaction, BlockchainResponse.class);
        return response != null ? response.getTxHash() : null;
    }

    private static class BlockchainResponse {
        private String txHash;
        
        public String getTxHash() {
            return txHash;
        }
        
        public void setTxHash(String txHash) {
            this.txHash = txHash;
        }
    }
}
